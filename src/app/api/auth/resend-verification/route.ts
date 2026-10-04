// =============================================================================
// RESEND VERIFICATION EMAIL API — POST /api/auth/resend-verification
// Issues a fresh verification token and dispatches email with rate limiting
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { verificationService } from "@/services/verification.service";
import { enforceRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rate-limiter";

const resendSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = await enforceRateLimit(req, {
      preset: "AUTH",
      identifier: ip,
      routePrefix: "/api/auth/resend-verification",
    });

    if (!rateLimit.isAllowed) {
      return createRateLimitResponse(
        rateLimit,
        "Too many requests. Please wait a moment before trying again."
      );
    }

    let emailToVerify: string | undefined;

    // Check if authenticated
    const { user } = await getCurrentSession();
    if (user?.email) {
      emailToVerify = user.email;
    }

    // Check body if provided
    try {
      const body = await req.json();
      const parsed = resendSchema.safeParse(body);
      if (parsed.success && parsed.data.email) {
        emailToVerify = parsed.data.email;
      }
    } catch {
      // Body is optional if user is logged in
    }

    if (!emailToVerify) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_EMAIL",
          message: "Please provide the email address to verify.",
        },
        { status: 400 }
      );
    }

    const result = await verificationService.resendVerificationEmail(emailToVerify);

    if (!result.success) {
      const status = result.error === "RATE_LIMITED" ? 429 : result.error === "ALREADY_VERIFIED" ? 400 : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An internal server error occurred while sending verification email.",
      },
      { status: 500 }
    );
  }
}
