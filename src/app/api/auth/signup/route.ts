// =============================================================================
// SIGNUP ROUTE HANDLER — POST /api/auth/signup
// Handles user registration, Argon2id password hashing, and atomic free quota
// allotment per REQ-B02, REQ-B03, and REQ-B12.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { enforceRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rate-limiter";
import { sanitizeString } from "@/lib/security/sanitize";
import { logger } from "@/lib/logger";
import { Role } from "@prisma/client";
import { emailService } from "@/services/email.service";
import { verificationService } from "@/services/verification.service";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters"),
  receiveNotifications: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = await enforceRateLimit(req, {
      preset: "AUTH",
      identifier: ip,
      routePrefix: "/api/auth/signup",
    });

    if (!rateLimit.isAllowed) {
      logger.security("AUTH", "Signup rate limit exceeded", { ip });
      return createRateLimitResponse(
        rateLimit,
        "Too many registration attempts. Please try again later."
      );
    }

    const body = await req.json();
    const validatedData = signupSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, receiveNotifications } = validatedData.data;
    const sanitizedName = sanitizeString(name);
    const normalizedEmail = sanitizeString(email).toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      logger.warn("AUTH", "Signup attempted with existing email", { email: normalizedEmail, ip });
      return NextResponse.json(
        {
          error: "An account with this email address already exists.",
          code: "EMAIL_EXISTS",
        },
        { status: 409 }
      );
    }

    // Hash password with Argon2id (OWASP standard)
    const passwordHash = await hashPassword(password);

    const userAgent = req.headers.get("user-agent") || undefined;

    // Create user with explicit notification preferences
    const newUser = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: normalizedEmail,
        passwordHash,
        role: Role.USER,
        isActive: true,
        receiveNotifications: Boolean(receiveNotifications),
        notifyEmail: Boolean(receiveNotifications),
        notifyMarketing: Boolean(receiveNotifications),
        notifySecurity: true,
      },
    });

    // Create initial welcome notification
    await prisma.notification.create({
      data: {
        userId: newUser.id,
        title: "ยินดีต้อนรับสู่ NAMENOLOGY!",
        message: "บัญชีของคุณพร้อมใช้งานแล้ว เริ่มต้นวิเคราะห์ศาสตร์แห่งชื่อของคุณได้ทันที พร้อมรับสิทธิ์ทดลองวิเคราะห์ฟรี",
        type: "SUCCESS",
        link: "/analyze",
      },
    });

    // Dispatch email verification link
    verificationService
      .sendVerificationEmailForUser(newUser.id, newUser.email, newUser.name)
      .catch((err) => {
        logger.warn("AUTH", "Failed to dispatch verification email", { error: String(err) });
      });

    // Send welcome email if user opted into email notifications
    if (receiveNotifications) {
      emailService.sendWelcomeEmail(newUser.email, newUser.name).catch((err) => {
        logger.warn("AUTH", "Failed to dispatch welcome email", { error: String(err) });
      });
    }

    // Create session in database
    const { session, token } = await createSession(newUser.id, {
      ipAddress: ip,
      userAgent,
    });

    // Set secure HttpOnly cookie
    setSessionCookie(token, session.expiresAt);

    logger.info("AUTH", "New user registered with initial allowances", {
      userId: newUser.id,
      email: normalizedEmail,
      ip,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("AUTH", "Unexpected error during signup", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}
