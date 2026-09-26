// =============================================================================
// STRIPE SDK INITIALIZATION & CONFIGURATION
// Gracefully handles production API keys as well as development mock mode
// =============================================================================

import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const isStripePlaceholder =
  !stripeSecretKey ||
  stripeSecretKey.includes("placeholder") ||
  process.env.MOCK_STRIPE === "true";

export const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia" as unknown as Stripe.LatestApiVersion,
  typescript: true,
});

export default stripe;
