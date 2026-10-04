// =============================================================================
// SIGNIN ROUTE HANDLER — POST /api/auth/signin
// Secure login verification with Argon2id, brute-force mitigation & session creation
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { enforceRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rate-limiter";
import { sanitizeString } from "@/lib/security/sanitize";
import { logger } from "@/lib/logger";

const signinSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(1, "Password is required").max(100),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = await enforceRateLimit(req, {
      preset: "AUTH",
      identifier: ip,
      routePrefix: "/api/auth/signin",
    });

    if (!rateLimit.isAllowed) {
      logger.security("AUTH", "Signin rate limit exceeded", { ip });
      return createRateLimitResponse(
        rateLimit,
        "Too many sign-in attempts. Please try again after 15 minutes."
      );
    }

    const body = await req.json();
    const validatedData = signinSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validatedData.data;
    const normalizedEmail = sanitizeString(email).toLowerCase();

    // Look up user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Account enumeration prevention: Return generic error if user not found or inactive
    if (!user || !user.isActive) {
      logger.warn("AUTH", "Failed signin attempt: user not found or inactive", {
        email: normalizedEmail,
        ip,
      });
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Timing-safe Argon2id password verification
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      logger.warn("AUTH", "Failed signin attempt: invalid password", {
        userId: user.id,
        ip,
      });
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create session in database
    const userAgent = req.headers.get("user-agent") || undefined;
    const { session, token } = await createSession(user.id, {
      ipAddress: ip,
      userAgent,
    });

    // Set secure HttpOnly cookie
    setSessionCookie(token, session.expiresAt);

    logger.info("AUTH", "User signed in successfully", {
      userId: user.id,
      role: user.role,
      ip,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.delete("namenology_free_trials");

    return response;
  } catch (error) {
    logger.error("AUTH", "Unexpected error during signin", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during signin." },
      { status: 500 }
    );
  }
}
