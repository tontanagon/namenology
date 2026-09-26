// =============================================================================
// USER CREDITS API ROUTE — GET /api/me/credits
// Returns comprehensive entitlement balances and audit ledger history
// per REQ-B12 and REQ-B37.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { entitlementService } from "@/services/entitlement.service";
import { CreditType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const typeParam = searchParams.get("type") as CreditType | null;

    const [summary, history] = await Promise.all([
      entitlementService.getUserEntitlements(user.id),
      entitlementService.getLedgerHistory(user.id, {
        limit: Math.min(50, Math.max(1, limit)),
        offset: Math.max(0, offset),
        creditType:
          typeParam && Object.values(CreditType).includes(typeParam)
            ? typeParam
            : undefined,
      }),
    ]);

    return NextResponse.json({
      success: true,
      summary,
      history,
    });
  } catch (error) {
    console.error("Fetch user credits error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve entitlement data." },
      { status: 500 }
    );
  }
}
