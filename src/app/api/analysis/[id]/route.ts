// =============================================================================
// SINGLE ANALYSIS REPORT API ROUTE — GET /api/analysis/[id]
// Returns detailed analysis report with component breakdown and character values
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { analysisService } from "@/services/analysis/analysis.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (!user.emailVerified && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "กรุณายืนยันอีเมลของคุณก่อนเข้าดูรายงานบทวิเคราะห์",
          code: "EMAIL_VERIFICATION_REQUIRED",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const analysis = await analysisService.getAnalysisById(
      id,
      user.id,
      user.role === "ADMIN"
    );

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis report not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve analysis.";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
