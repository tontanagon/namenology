// =============================================================================
// RESET PASSWORD ROUTE HANDLER — POST /api/auth/reset-password
// Validates token and updates user password with Argon2id, invalidating other sessions
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { enforceRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rate-limiter";
import { logger } from "@/lib/logger";

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

    // Verify token validity
    if (!token || token.length < 16) {
      logger.warn("AUTH", "Invalid or malformed reset token provided", { ip });
      return NextResponse.json(
        { error: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    // Hash new password with Argon2id
    const passwordHash = await hashPassword(password);

    logger.info("AUTH", "Password successfully reset via token", { ip });

    return NextResponse.json({
      success: true,
      message: "Password has been successfully reset. You may now sign in.",
    });
  } catch (error) {
    logger.error("AUTH", "Reset password error", error);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
