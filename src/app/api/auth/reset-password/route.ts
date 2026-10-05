// =============================================================================
// RESET PASSWORD ROUTE HANDLER — POST /api/auth/reset-password
// Validates token and updates user password with Argon2id, invalidating other sessions
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { enforceRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rate-limiter";
import { logger } from "@/lib/logger";

import { prisma } from "@/lib/prisma";
import { emailService } from "@/services/email.service";

const resetSchema = z.object({
  token: z.string().min(1, "Reset token is required").max(500),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = await enforceRateLimit(req, {
      preset: "AUTH",
      identifier: ip,
      routePrefix: "/api/auth/reset-password",
    });

    if (!rateLimit.isAllowed) {
      logger.security("AUTH", "Reset password rate limit exceeded", { ip });
      return createRateLimitResponse(rateLimit, "Too many attempts. Please try again later.");
    }

    const body = await req.json();
    const validated = resetSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid password requirements." },
        { status: 400 }
      );
    }

    const { token, password } = validated.data;

    // Look up token in database
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.expiresAt.getTime() < Date.now()) {
      if (resetRecord) {
        await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } }).catch(() => {});
      }
      logger.warn("AUTH", "Invalid or expired reset token provided", { ip });
      return NextResponse.json(
        { error: "Invalid or expired reset token. Please request a new link." },
        { status: 400 }
      );
    }

    // Hash new password with Argon2id
    const passwordHash = await hashPassword(password);

    // Atomically update password, revoke all existing sessions, and consume reset token
    await prisma.$transaction(async (tx) => {
      // 1. Update user password
      await tx.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      });

      // 2. Revoke all active sessions across all devices for security
      await tx.session.deleteMany({
        where: { userId: resetRecord.userId },
      });

      // 3. Delete used reset token
      await tx.passwordResetToken.delete({
        where: { id: resetRecord.id },
      });
    });

    // Send security alert email
    emailService
      .sendPasswordChangedEmail(resetRecord.user.email, resetRecord.user.name)
      .catch((err) => {
        logger.warn("AUTH", "Failed to dispatch password changed confirmation email", { error: String(err) });
      });

    logger.info("AUTH", "Password successfully reset via token", { userId: resetRecord.userId, ip });

    return NextResponse.json({
      success: true,
      message: "Password has been successfully reset. You may now sign in with your new password.",
    });
  } catch (error) {
    logger.error("AUTH", "Reset password error", error);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
