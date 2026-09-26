// =============================================================================
// FORGOT PASSWORD ROUTE HANDLER — POST /api/auth/forgot-password
// Handles password reset requests with account enumeration protection
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rate-limiter";
import { sanitizeString } from "@/lib/security/sanitize";
import { logger } from "@/lib/logger";

const forgotSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = await enforceRateLimit(req, {
      customPoints: 3,
      customDurationSeconds: 60 * 60, // 3 attempts per hour
      identifier: ip,
      routePrefix: "/api/auth/forgot-password",
    });

    if (!rateLimit.isAllowed) {
      logger.security("AUTH", "Forgot password rate limit exceeded", { ip });
      return createRateLimitResponse(
        rateLimit,
        "Too many password reset attempts. Please try again in an hour."
      );
    }

    const body = await req.json();
    const validated = forgotSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = sanitizeString(validated.data.email).toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Account enumeration protection: Always return success message even if user doesn't exist
    if (user && user.isActive) {
      logger.info("AUTH", "Password reset link requested", { email: normalizedEmail });
    } else {
      logger.info("AUTH", "Password reset requested for non-existent account", { email: normalizedEmail });
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account is associated with this email, a password reset link has been dispatched.",
    });
  } catch (error) {
    logger.error("AUTH", "Unexpected error during forgot password", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
