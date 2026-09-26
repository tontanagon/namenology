// =============================================================================
// STRIPE SERVICE — BILLING, CHECKOUT & WEBHOOK ORCHESTRATION
// Enforces server-side price validation, atomic entitlement granting, idempotency,
// and seamless development simulation mode (REQ-B01, B11, B12, B13, B30, B32, B49, B51).
// =============================================================================

import { prisma } from "@/lib/prisma";
import { stripe, isStripePlaceholder } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import {
  OrderStatus,
  ProductType,
  CreditSourceType,
  ServiceOrderStatus,
  SubscriptionStatus,
  Prisma,
} from "@prisma/client";
import type Stripe from "stripe";

export interface CreateCheckoutParams {
  userId: string;
  productId: string;
  appUrl: string;
}

export class StripeService {
  /**
   * Creates an order record and initiates a Stripe Checkout session.
   * Never trusts client-side prices (REQ-B49).
   */
  async createCheckoutSession(params: CreateCheckoutParams) {
    const { userId, productId, appUrl } = params;

    // 1. Load and validate product from server database
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { entitlements: true },
    });

    if (!product || !product.isActive) {
      throw new Error("The selected product is either inactive or does not exist.");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User account not found.");
    }

    // 2. Create Order in database with PENDING status
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        productId: product.id,
        amount: product.price,
        currency: product.currency,
        status: OrderStatus.PENDING,
      },
    });

    // 3. Handle Development Mock Mode when real Stripe keys are not configured
    if (isStripePlaceholder) {
      const mockSessionId = `mock_cs_${order.id.slice(0, 8)}_${Date.now()}`;
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeCheckoutSessionId: mockSessionId },
      });

      // In development mock mode, auto-process the completed order so user can immediately test!
      await this.processCompletedCheckout({
        sessionId: mockSessionId,
        orderId: order.id,
        userId: user.id,
        productId: product.id,
      });

      return {
        checkoutUrl: `${appUrl}/dashboard?payment=success&orderId=${order.id}`,
        orderId: order.id,
        isSimulated: true,
      };
    }

    // 4. Real Stripe Mode: ensure Stripe Customer exists
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // 5. Create Stripe Checkout Session
    const isSubscription = product.productType === ProductType.SUBSCRIPTION;
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: isSubscription ? "subscription" : "payment",
      line_items: product.stripePriceId
        ? [{ price: product.stripePriceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: product.currency.toLowerCase(),
                product_data: {
                  name: product.name,
                  description: product.description || undefined,
                },
                unit_amount: Math.round(Number(product.price) * 100),
              },
              quantity: 1,
            },
          ],
      success_url: `${appUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?payment=cancelled`,
      metadata: {
        userId: user.id,
        productId: product.id,
        orderId: order.id,
      },
      client_reference_id: order.id,
    });

    // Update order with checkout session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeCheckoutSessionId: session.id,
        stripeCustomerId,
      },
    });

    return {
      checkoutUrl: session.url || `${appUrl}/dashboard?payment=success`,
      orderId: order.id,
      isSimulated: false,
    };
  }

  /**
   * Processes a verified completed checkout event.
   * Atomically marks order PAID and grants entitlements to credit_ledger or service_orders.
   */
  async processCompletedCheckout(data: {
    sessionId: string;
    orderId?: string;
    userId: string;
    productId: string;
    paymentIntentId?: string;
    subscriptionId?: string;
  }) {
    const { sessionId, orderId, userId, productId, paymentIntentId, subscriptionId } = data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { entitlements: true },
    });

    if (!product) {
      logger.error("STRIPE", "Product not found for checkout completion", undefined, { productId });
      return;
    }

    // Atomic transaction: Update Order + Grant Entitlements
    await prisma.$transaction(async (tx) => {
      // 1. Update Order status
      const orderWhere = orderId
        ? { id: orderId }
        : { stripeCheckoutSessionId: sessionId };

      const existingOrder = await tx.order.findFirst({ where: orderWhere });
      let currentOrderId = orderId;

      if (existingOrder) {
        currentOrderId = existingOrder.id;
        await tx.order.update({
          where: { id: existingOrder.id },
          data: {
            status: OrderStatus.PAID,
            paidAt: new Date(),
            stripePaymentIntentId: paymentIntentId || existingOrder.stripePaymentIntentId,
            stripeSubscriptionId: subscriptionId || existingOrder.stripeSubscriptionId,
          },
        });
      }

      // 2. Grant Entitlements based on Product Type (REQ-B11, B13, B32, B55)
      if (product.productType === ProductType.ANALYSIS_PACKAGE) {
        // Grant finite credits for each configured credit bucket (REQ-B06 to B10)
        for (const ent of product.entitlements) {
          if (ent.quantity > 0) {
            await tx.creditLedger.create({
              data: {
                userId,
                creditType: ent.creditType,
                amount: ent.quantity,
                sourceType: CreditSourceType.PURCHASE,
                sourceId: currentOrderId || sessionId,
              },
            });
          }
        }
      } else if (product.productType === ProductType.SERVICE) {
        // Professional services generate a Service Order workflow instead of raw analysis credits (REQ-B11, B25, B44)
        await tx.serviceOrder.create({
          data: {
            userId,
            productId: product.id,
            orderId: currentOrderId,
            status: ServiceOrderStatus.PAID,
            notes: `Purchased service: ${product.name}`,
          },
        });
      } else if (product.productType === ProductType.SUBSCRIPTION) {
        // Recurring subscription handling
        if (subscriptionId) {
          await tx.subscription.upsert({
            where: { stripeSubscriptionId: subscriptionId },
            update: {
              status: SubscriptionStatus.ACTIVE,
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            create: {
              userId,
              productId: product.id,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: product.stripePriceId || "default_price",
              status: SubscriptionStatus.ACTIVE,
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }
      }
    });
  }

  /**
   * Processes incoming Stripe Webhooks with signature validation and idempotency (REQ-B51).
   */
  async handleWebhookEvent(event: Stripe.Event): Promise<{ success: boolean; duplicate?: boolean }> {
    const eventId = event.id;

    // 1. Idempotency Check: prevent duplicate event processing (REQ-B51)
    const existing = await prisma.stripeWebhookEvent.findUnique({
      where: { stripeEventId: eventId },
    });

    if (existing && existing.processed) {
      return { success: true, duplicate: true };
    }

    if (!existing) {
      await prisma.stripeWebhookEvent.create({
        data: {
          stripeEventId: eventId,
          eventType: event.type,
          processed: false,
        },
      });
    }

    // 2. Dispatch event handling
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const userId = metadata.userId;
        const productId = metadata.productId;
        const orderId = metadata.orderId || session.client_reference_id || undefined;

        if (userId && productId) {
          await this.processCompletedCheckout({
            sessionId: session.id,
            orderId,
            userId,
            productId,
            paymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : undefined,
            subscriptionId:
              typeof session.subscription === "string"
                ? session.subscription
                : undefined,
          });
        }
        break;
      }

      case "charge.refunded": {
        // Refund handling per REQ-B34: revoke unused credits
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : undefined;

        if (paymentIntentId) {
          const order = await prisma.order.findFirst({
            where: { stripePaymentIntentId: paymentIntentId },
            include: { product: { include: { entitlements: true } } },
          });

          if (order) {
            await prisma.$transaction(async (tx) => {
              await tx.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.REFUNDED },
              });

              // Revoke package credits
              for (const ent of order.product.entitlements) {
                await tx.creditLedger.create({
                  data: {
                    userId: order.userId,
                    creditType: ent.creditType,
                    amount: -ent.quantity, // Revoke
                    sourceType: CreditSourceType.REFUND,
                    sourceId: order.id,
                  },
                });
              }
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.order.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: OrderStatus.FAILED },
        });
        break;
      }
    }

    // 3. Mark webhook event as processed
    await prisma.stripeWebhookEvent.update({
      where: { stripeEventId: eventId },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });

    return { success: true };
  }

  /**
   * Generates a Customer Billing Portal session for managing subscriptions.
   */
  async createCustomerPortalSession(userId: string, returnUrl: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.stripeCustomerId) {
      throw new Error("No billing customer profile found for this account.");
    }

    if (isStripePlaceholder) {
      return { portalUrl: `${returnUrl}/dashboard?portal=simulated` };
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    return { portalUrl: portal.url };
  }
}

export const stripeService = new StripeService();
