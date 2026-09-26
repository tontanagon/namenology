// =============================================================================
// STRIPE CUSTOMER PORTAL API ROUTE — POST /api/stripe/portal
// Generates Customer Billing Portal session for self-service subscription management
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { stripeService } from "@/services/stripe.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const portal = await stripeService.createCustomerPortalSession(
      user.id,
      `${appUrl}/dashboard`
    );

    return NextResponse.json(portal);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate portal session.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
