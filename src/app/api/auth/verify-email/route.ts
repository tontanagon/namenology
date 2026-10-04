// =============================================================================
// VERIFY EMAIL API — GET /api/auth/verify-email?token=...
// Validates email verification token and marks user's email as verified
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { verificationService } from "@/services/verification.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_TOKEN",
          message: "Verification token is required.",
        },
        { status: 400 }
      );
    }

    const result = await verificationService.verifyEmailToken(token);

    if (!result.success) {
      const status = result.error === "INVALID_TOKEN" ? 400 : result.error === "EXPIRED_TOKEN" ? 410 : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Email verification API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An internal server error occurred while verifying email.",
      },
      { status: 500 }
    );
  }
}
