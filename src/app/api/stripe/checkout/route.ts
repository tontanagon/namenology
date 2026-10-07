// =============================================================================
// STRIPE CHECKOUT API ROUTE — POST /api/stripe/checkout
// Creates checkout session and order record with server-side price validation
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { stripeService } from "@/services/stripe.service";
import { enforceRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
});

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to initiate checkout." },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      logger.security("STRIPE", "Checkout attempted by unverified user", { userId: user.id });
      return NextResponse.json(
        {
          error: "Please verify your email address before initiating payment.",
          code: "EMAIL_VERIFICATION_REQUIRED",
        },
        { status: 403 }
      );
    }

    const rateLimit = await enforceRateLimit(req, {
      preset: "CHECKOUT",
      identifier: user.id,
      routePrefix: "/api/stripe/checkout",
    });

    if (!rateLimit.isAllowed) {
      logger.security("STRIPE", "Checkout rate limit exceeded", { userId: user.id });
      return createRateLimitResponse(
        rateLimit,
        "Too many checkout attempts. Please try again in a few minutes."
      );
    }

    const body = await req.json();
    const validated = checkoutSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid product selection." },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const session = await stripeService.createCheckoutSession({
      userId: user.id,
      productId: validated.data.productId,
      appUrl,
    });

    logger.info("STRIPE", "Checkout session created", {
      userId: user.id,
      productId: validated.data.productId,
    });

    return NextResponse.json(session);
  } catch (error) {
    logger.error("STRIPE", "Stripe checkout failed", error);
    const message =
      error instanceof Error ? error.message : "Failed to initiate checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
