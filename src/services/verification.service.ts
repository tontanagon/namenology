// =============================================================================
// EMAIL VERIFICATION SERVICE
// Handles secure token generation, verification email dispatch, and email confirmation
// =============================================================================

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/services/email.service";
import { logger } from "@/lib/logger";

export interface VerifyResult {
  success: boolean;
  error?: "INVALID_TOKEN" | "EXPIRED_TOKEN" | "ALREADY_VERIFIED" | "SERVER_ERROR" | "RATE_LIMITED";
  message: string;
  email?: string;
}

// In-memory cache to gracefully handle immediate duplicate verification requests
// (e.g. React 18 StrictMode double-mounting, double-clicks, or email client link pre-fetching)
const recentlyVerifiedTokens = new Map<string, { email: string; timestamp: number }>();
const inFlightVerifications = new Map<string, Promise<VerifyResult>>();

function cleanRecentTokens() {
  const cutoff = Date.now() - 60 * 1000;
  recentlyVerifiedTokens.forEach((val, key) => {
    if (val.timestamp < cutoff) {
      recentlyVerifiedTokens.delete(key);
    }
  });
}

export class VerificationService {
  /**
   * Generates a cryptographically secure token, cleans up old tokens,
   * and persists the token in the database (valid for 24 hours).
   */
  async createVerificationToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Clean up any existing tokens for this user
    await prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });

    // Create the new verification token
    await prisma.emailVerificationToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return token;
  }

  /**
   * Generates a token and sends the verification email to the user.
   */
  async sendVerificationEmailForUser(
    userId: string,
    email: string,
    name: string
  ): Promise<boolean> {
    try {
      const token = await this.createVerificationToken(userId);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const verifyUrl = `${appUrl}/verify-email?token=${token}`;

      const result = await emailService.sendVerificationEmail(email, name, verifyUrl);
      logger.info("AUTH", "Email verification link dispatched", {
        userId,
        email,
        success: result.success,
      });

      return result.success;
    } catch (error) {
      logger.error("AUTH", "Failed to dispatch email verification link", {
        userId,
        email,
        error: String(error),
      });
      return false;
    }
  }

  /**
   * Validates a token and marks user.emailVerified = new Date().
   * Handles concurrent / duplicate requests via in-flight de-duplication and idempotency cache.
   */
  async verifyEmailToken(token: string): Promise<VerifyResult> {
    if (!token || typeof token !== "string" || token.trim() === "") {
      return {
        success: false,
        error: "INVALID_TOKEN",
        message: "Invalid verification token.",
      };
    }

    const cleanToken = token.trim();

    // 1. In-flight deduplication: If a verification for this exact token is already in progress, await it
    const running = inFlightVerifications.get(cleanToken);
    if (running) {
      return await running;
    }

    // 2. Idempotency cache: If this token was verified within the last 60 seconds, return success immediately
    const recent = recentlyVerifiedTokens.get(cleanToken);
    if (recent && Date.now() - recent.timestamp < 60 * 1000) {
      return {
        success: true,
        message: "Your email address has been successfully verified!",
        email: recent.email,
      };
    }

    const task = (async (): Promise<VerifyResult> => {
      try {
        const record = await prisma.emailVerificationToken.findUnique({
          where: { token: cleanToken },
          include: { user: true },
        });

        if (!record) {
          // Double check if another parallel request just finished
          const justVerified = recentlyVerifiedTokens.get(cleanToken);
          if (justVerified && Date.now() - justVerified.timestamp < 60 * 1000) {
            return {
              success: true,
              message: "Your email address has been successfully verified!",
              email: justVerified.email,
            };
          }

          return {
            success: false,
            error: "INVALID_TOKEN",
            message: "This verification link is invalid or has already been used.",
          };
        }

        // Check if token has expired
        if (new Date() > record.expiresAt) {
          await prisma.emailVerificationToken.delete({
            where: { id: record.id },
          }).catch(() => {});

          return {
            success: false,
            error: "EXPIRED_TOKEN",
            message: "This verification link has expired. Please request a new one.",
          };
        }

        // Atomically mark user as verified and delete token
        try {
          await prisma.$transaction([
            prisma.user.update({
              where: { id: record.userId },
              data: { emailVerified: new Date() },
            }),
            prisma.emailVerificationToken.delete({
              where: { id: record.id },
            }),
          ]);
        } catch (txError: any) {
          // Handle P2025: Record to delete does not exist (e.g. concurrent execution)
          if (txError?.code === "P2025") {
            const cached = recentlyVerifiedTokens.get(cleanToken);
            if (cached) {
              return {
                success: true,
                message: "Your email address has been successfully verified!",
                email: cached.email,
              };
            }
          }
          throw txError;
        }

        // Cache this token as recently verified to protect against immediate duplicate requests
        cleanRecentTokens();
        recentlyVerifiedTokens.set(cleanToken, {
          email: record.user.email,
          timestamp: Date.now(),
        });

        logger.info("AUTH", "User email verified successfully", {
          userId: record.userId,
          email: record.user.email,
        });

        return {
          success: true,
          message: "Your email address has been successfully verified!",
          email: record.user.email,
        };
      } catch (error) {
        logger.error("AUTH", "Error during email token verification", error);
        return {
          success: false,
          error: "SERVER_ERROR",
          message: "An unexpected error occurred while verifying your email.",
        };
      } finally {
        inFlightVerifications.delete(cleanToken);
      }
    })();

    inFlightVerifications.set(cleanToken, task);
    return await task;
  }

  /**
   * Resends a verification email for the given email address.
   * Includes rate limiting protection (1 request per 60 seconds).
   */
  async resendVerificationEmail(email: string): Promise<VerifyResult> {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        emailVerificationTokens: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      // Don't disclose user non-existence for security, return generic success
      return {
        success: true,
        message: "If an account exists with this email, a verification link has been sent.",
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: "ALREADY_VERIFIED",
        message: "This email address is already verified.",
      };
    }

    // Rate-limiting check: 60 seconds between resend requests
    const latestToken = user.emailVerificationTokens[0];
    if (latestToken) {
      const msSinceLast = Date.now() - latestToken.createdAt.getTime();
      if (msSinceLast < 60 * 1000) {
        const remainingSeconds = Math.ceil((60000 - msSinceLast) / 1000);
        return {
          success: false,
          error: "RATE_LIMITED",
          message: `Please wait ${remainingSeconds} seconds before requesting another email.`,
        };
      }
    }

    const sent = await this.sendVerificationEmailForUser(user.id, user.email, user.name);

    if (!sent) {
      return {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to dispatch verification email. Please check your email configuration.",
      };
    }

    return {
      success: true,
      message: `A fresh verification link has been sent to ${user.email}. Please check your inbox.`,
    };
  }
}

export const verificationService = new VerificationService();
