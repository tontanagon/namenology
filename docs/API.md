# API SPECIFICATION — NAMENOLOGY

Last Updated: 2026-09-22

---

All endpoints use JSON request/response bodies unless otherwise noted. Protected endpoints require a valid session cookie. Admin endpoints require `role = ADMIN`.

---

## 1. Authentication

### POST /api/auth/signup

Create a new user account with automatic free credit allocation.

**Request:**
```json
{
  "name": "string (required, 1-255 chars)",
  "email": "string (required, valid email, unique)",
  "password": "string (required, >= 8 chars, strength validated)",
  "confirmPassword": "string (required, must match password)"
}
```

**Response 201:**
```json
{
  "user": { "id": "uuid", "email": "string", "name": "string", "role": "USER" },
  "message": "Account created successfully"
}
```

**Errors:** 400 (validation), 409 (email exists), 429 (rate limited)

**Side Effects:** Creates user, allocates free credits (2 FIRST_NAME, 2 SURNAME, 0 COMBINED) via credit_ledger, sets session cookie.

---

### POST /api/auth/signin

Authenticate with email and password.

**Request:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response 200:**
```json
{
  "user": { "id": "uuid", "email": "string", "name": "string", "role": "USER|ADMIN" }
}
```

**Errors:** 401 (invalid credentials — generic message to prevent account enumeration), 429 (rate limited)

---

### POST /api/auth/signout

Destroy current session.

**Response 200:**
```json
{ "message": "Signed out successfully" }
```

**Side Effects:** Deletes session record, clears session cookie.

---

## 2. User Profile

### GET /api/me

Get current authenticated user profile.

**Response 200:**
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "role": "USER|ADMIN",
  "createdAt": "ISO 8601"
}
```

### GET /api/me/usage

Get current credit balances and usage statistics.

**Response 200:**
```json
{
  "credits": {
    "FIRST_NAME": { "remaining": 2, "total_used": 0 },
    "SURNAME": { "remaining": 2, "total_used": 0 },
    "COMBINED": { "remaining": 0, "total_used": 0 }
  },
  "totalAnalyses": 0
}
```

### GET /api/me/subscription

Get current subscription/purchase status.

**Response 200:**
```json
{
  "hasActiveSubscription": false,
  "currentPlan": null,
  "recentOrders": []
}
```

---

## 3. Analysis

### POST /api/analysis

Perform a name analysis. Consumes one credit of the appropriate type.

**Request:**
```json
{
  "analysisType": "FIRST_NAME | SURNAME | COMBINED",
  "inputs": {
    "FIRST_NAME": "Michael",
    "SURNAME": "Smith"
  }
}
```

For `FIRST_NAME` type, only `inputs.FIRST_NAME` is required.
For `SURNAME` type, only `inputs.SURNAME` is required.
For `COMBINED` type, both are required.

**Response 201:**
```json
{
  "id": "uuid",
  "analysisType": "FIRST_NAME",
  "finalScore": 84.25,
  "interpretation": {
    "category": "EXCELLENT",
    "title": "Highly Auspicious",
    "description": "...",
    "recommendation": "..."
  },
  "components": [
    {
      "key": "FIRST_NAME",
      "input": "Michael",
      "score": 84.25,
      "weight": 100,
      "characters": [
        { "char": "M", "score": 85, "position": 0 },
        { "char": "i", "score": 78, "position": 1 }
      ]
    }
  ],
  "calculationVersion": "1.0",
  "createdAt": "ISO 8601"
}
```

**Errors:** 400 (validation), 401 (unauthenticated), 403 (insufficient credits), 429 (rate limited)

**Transaction:** Credit check + reservation + calculation + storage happen atomically.

---

### GET /api/analysis/history

Get paginated analysis history for current user.

**Query Params:** `page` (default 1), `limit` (default 20), `type` (filter by FIRST_NAME|SURNAME|COMBINED)

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "analysisType": "FIRST_NAME",
      "inputMasked": "Mic****",
      "finalScore": 84.25,
      "status": "COMPLETED",
      "createdAt": "ISO 8601"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

### GET /api/analysis/:id

Get full analysis detail with character breakdown.

**Response 200:** Same as POST /api/analysis response body.

---

## 4. Stripe

### POST /api/stripe/checkout

Create a Stripe Checkout Session for a product purchase.

**Request:**
```json
{
  "productId": "uuid"
}
```

**Response 200:**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

Server loads product from DB, validates active status, creates checkout with `stripe_price_id`.

### POST /api/stripe/portal

Create a Stripe Customer Portal session.

**Response 200:**
```json
{
  "portalUrl": "https://billing.stripe.com/..."
}
```

### POST /api/stripe/webhook

Stripe webhook receiver. **Not called by frontend.**

- Reads raw request body
- Verifies Stripe signature using `STRIPE_WEBHOOK_SECRET`
- Checks idempotency via `stripe_webhook_events` table
- Processes events: `checkout.session.completed`, `customer.subscription.*`, `charge.refunded`
- Returns 200 (processed) or 400 (signature invalid)

---

## 5. Admin

All admin endpoints require `role = ADMIN`. All mutations create audit log entries.

### GET /api/admin/users
Query params: `search`, `page`, `limit`, `role`, `status`

### GET /api/admin/characters
Query params: `search`, `language`, `status`, `page`, `limit`, `sortBy`, `sortOrder`

### POST /api/admin/characters
Create character score. Body: `{ character, language, score }`

### PATCH /api/admin/characters/:id
Update character score. Body: `{ score?, is_active? }`

### DELETE /api/admin/characters/:id
Soft-delete or deactivate character score.

### GET /api/admin/components
List all name components with weights.

### POST /api/admin/components
Add new component. Body: `{ key, label, description, is_required, is_enabled, weight, sort_order }`

### PATCH /api/admin/components/:id
Update component. **Server validates total weight = 100% for enabled components.**

### GET /api/admin/settings
Get current active analysis config.

### PATCH /api/admin/settings
Update analysis config. Body: partial `analysis_configs` fields.

### GET /api/admin/products
List all products.

### POST /api/admin/products
Create product with entitlements.

### PATCH /api/admin/products/:id
Update product.

### GET /api/admin/service-orders
Query params: `status`, `productId`, `page`, `limit`

### PATCH /api/admin/service-orders/:id
Update service order status, assign admin, add notes, submit result.

### GET /api/admin/audit-logs
Query params: `adminId`, `action`, `targetType`, `page`, `limit`, `from`, `to`

---

## 6. Utility

### GET /api/health

Health check endpoint.

**Response 200:**
```json
{
  "status": "ok",
  "service": "namenology-api",
  "timestamp": "ISO 8601",
  "version": "0.1.0"
}
```
