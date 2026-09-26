# STRIPE INTEGRATION — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. Overview

Namenology uses Stripe for all payment processing. The system supports one-time analysis package purchases, professional service payments, and future recurring subscriptions.

**Key Principle:** The server is the sole authority for payment verification and credit granting. The browser NEVER determines payment success or entitlement state.

---

## 2. Stripe Objects Used

| Stripe Object | Purpose |
|---|---|
| Customer | Linked to `users.stripe_customer_id`, created on first purchase |
| Checkout Session | Hosted payment page for package/service purchases |
| Price | Defines the charge amount (linked via `products.stripe_price_id`) |
| Subscription | For future recurring plans |
| Customer Portal | Self-service subscription management |
| Webhook | Server-side event notifications |

---

## 3. Checkout Flow

```
1. Client sends POST /api/stripe/checkout with { productId }
2. Server loads product from DB by productId
3. Server validates:
   - Product exists
   - Product is_active = true
   - Product has a valid stripe_price_id
4. Server creates or retrieves Stripe Customer for the user
5. Server creates Stripe Checkout Session:
   - mode: "payment" (one-time) or "subscription" (recurring)
   - line_items: [{ price: product.stripe_price_id, quantity: 1 }]
   - success_url: APP_URL/dashboard?payment=success
   - cancel_url: APP_URL/pricing?payment=cancelled
   - metadata: { userId, productId, orderId }
6. Server returns { checkoutUrl }
7. Client redirects to Stripe Checkout
8. After payment, Stripe redirects to success_url
9. IMPORTANT: The redirect does NOT grant credits.
   Credits are granted ONLY via webhook.
```

---

## 4. Webhook Processing

### Endpoint: POST /api/stripe/webhook

### Security
1. Read raw request body (NOT parsed JSON)
2. Verify Stripe signature using `STRIPE_WEBHOOK_SECRET`
3. Reject if signature invalid (return 400)

### Idempotency
1. Extract `event.id` from the Stripe event
2. Check `stripe_webhook_events` table for existing record with same `stripe_event_id`
3. If already processed: return 200 (skip processing)
4. If new: insert record with `processed = false`

### Event Handlers

#### checkout.session.completed
```
1. Extract metadata (userId, productId)
2. Load product from DB
3. Create order record (status: PAID)
4. Load product_entitlements for this product
5. For each entitlement:
   - Insert credit_ledger entry (amount: quantity, source_type: PURCHASE, source_id: orderId)
6. Mark webhook event as processed
```

#### customer.subscription.created / updated / deleted
```
1. Extract subscription data
2. Sync subscription status to local DB
3. Update user entitlements based on subscription status
4. Handle states: trialing, active, past_due, canceled, unpaid, incomplete
```

#### charge.refunded
```
1. Find related order by payment_intent_id
2. Calculate unused credits per type
3. Insert negative credit_ledger entries (source_type: REFUND)
4. Update order status to REFUNDED
5. Log the action in audit trail
```

#### invoice.payment_failed
```
1. Log the failure
2. Update subscription status if applicable
3. Optionally notify admin
```

---

## 5. Stripe Customer Portal

For users with active subscriptions, provide self-service management:

```
POST /api/stripe/portal
→ Server creates Stripe Customer Portal session
→ Returns portalUrl
→ Client redirects to Stripe Portal
→ User can: cancel subscription, update payment method, view invoices
```

---

## 6. Environment Variables

```
STRIPE_SECRET_KEY       → Server-side API key (sk_test_... or sk_live_...)
STRIPE_WEBHOOK_SECRET   → Webhook endpoint signing secret (whsec_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY → Client-side publishable key (pk_test_...)
```

**CRITICAL:**
- NEVER expose `STRIPE_SECRET_KEY` to the client
- NEVER commit real keys to version control
- Use test mode keys during development

---

## 7. Product ↔ Stripe Price ID Mapping

Products in the database have a `stripe_price_id` field that maps to a Stripe Price object:

| Product | stripe_price_id | Amount |
|---|---|---|
| 1 Complete Set | price_xxx_19 | $19.00 |
| 2 Complete Sets | price_xxx_24 | $24.00 |
| 3 Complete Sets | price_xxx_45 | $45.00 |
| 5 Complete Sets | price_xxx_65 | $65.00 |
| Baby Naming | price_xxx_150 | $150.00 |
| Name Change | price_xxx_190 | $190.00 |
| Surname Creation | price_xxx_360 | $360.00 |

Admin can update Stripe Price IDs through the admin dashboard. The Stripe Price ID is the source of truth for the actual amount charged.

---

## 8. Security Checklist

- [ ] Webhook signature verified on every request
- [ ] Raw body used for signature verification (not parsed JSON)
- [ ] Idempotent event processing via stripe_webhook_events table
- [ ] Credits granted ONLY after webhook confirmation
- [ ] Browser redirect never used to determine payment success
- [ ] Stripe secret key never exposed to client
- [ ] Price/amount never sent from client to server for checkout creation
- [ ] All payment records stored in orders table
- [ ] Refund handling preserves financial history
- [ ] Duplicate events handled gracefully (return 200, skip processing)
