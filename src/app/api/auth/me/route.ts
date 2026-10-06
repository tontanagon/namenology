// =============================================================================
// CURRENT USER PROFILE & CREDIT BALANCES — GET /api/auth/me
// Returns sanitized user profile and real-time calculated credit balances
// per REQ-B03, REQ-B12, and REQ-B37.
// =============================================================================

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { CreditType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user } = await getCurrentSession();
    const cookieStore = await cookies();
    const cookieTrials = parseInt(
      cookieStore.get("namenology_free_trials")?.value || "0",
      10
    );

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          analysesCount: cookieTrials,
          credits: {
            total: 0,
            firstName: 0,
            surname: 0,
            combined: 0,
          },
        },
        { status: 200 }
      );
    }

    // Calculate real-time credit balances from credit_ledger (ADR-003, REQ-B12)
    const ledgerAggregates = await prisma.creditLedger.groupBy({
      by: ["creditType"],
      where: { userId: user.id },
      _sum: { amount: true },
    });

    const balances: Record<CreditType, number> = {
      [CreditType.FIRST_NAME]: 0,
      [CreditType.SURNAME]: 0,
      [CreditType.COMBINED]: 0,
    };

    for (const entry of ledgerAggregates) {
      balances[entry.creditType] = entry._sum.amount ?? 0;
    }

    const fnBal = Math.max(0, balances[CreditType.FIRST_NAME]);
    const snBal = Math.max(0, balances[CreditType.SURNAME]);
    const cbBal = Math.max(0, balances[CreditType.COMBINED]);
    // Full name analysis uses 1 combined credit OR 1 pair of (first name + surname)
    const totalCredits = cbBal + Math.min(fnBal, snBal);

    const analysesCount = await prisma.analysis.count({
      where: { userId: user.id },
    });

    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        isEmailVerified: Boolean(user.emailVerified),
        stripeCustomerId: user.stripeCustomerId,
        createdAt: user.createdAt,
      },
      isEmailVerified: Boolean(user.emailVerified),
      analysesCount,
      credits: {
        total: totalCredits,
        firstName: fnBal,
        surname: snBal,
        combined: cbBal,
      },
    });

    // Clear any leftover guest trial cookie so it never leaks across accounts
    response.cookies.delete("namenology_free_trials");

    return response;
  } catch (error) {
    console.error("Fetch current user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
