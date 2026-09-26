// =============================================================================
// STRIPE WEBHOOK API ROUTE — POST /api/stripe/webhook
// Raw signature verification, idempotency checking, and event dispatching
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripePlaceholder } from "@/lib/stripe";
import { stripeService } from "@/services/stripe.service";
import { logger } from "@/lib/logger";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (isStripePlaceholder || !webhookSecret || webhookSecret.includes("placeholder")) {
      // In development simulation mode, parse event payload directly
      event = JSON.parse(body) as Stripe.Event;
    } else {
      if (!signature) {
        logger.security("STRIPE_WEBHOOK", "Missing stripe-signature header");
        return NextResponse.json(
          { error: "Missing stripe-signature header" },
          { status: 400 }
        );
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    logger.security("STRIPE_WEBHOOK", `Signature verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const result = await stripeService.handleWebhookEvent(event);
    logger.info("STRIPE_WEBHOOK", `Successfully processed event ${event.type}`, {
      eventId: event.id,
      eventType: event.type,
    });
    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    logger.error("STRIPE_WEBHOOK", "Error processing Stripe webhook", err, {
      eventId: event.id,
      eventType: event.type,
    });
    return NextResponse.json(
      { error: "Webhook processing failure." },
      { status: 500 }
    );
  }
}
