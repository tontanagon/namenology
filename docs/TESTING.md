# TESTING STRATEGY — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. Overview

Testing follows a pyramid strategy: extensive unit tests for business logic, integration tests for API and database interactions, and targeted E2E tests for critical user flows.

| Layer | Tool | Focus |
|---|---|---|
| Unit Tests | Vitest | Scoring engine, weight calculation, entitlement logic, validation schemas |
| Integration Tests | Vitest + Prisma Test DB | API routes, database transactions, webhook processing |
| E2E Tests | Playwright | Full user flows (signup → analysis → paywall → purchase) |

---

## 2. Unit Tests

### 2.1 Scoring Engine (`services/analysis/scoring.service.test.ts`)
- Calculate component score for English characters
- Calculate component score for Thai characters
- Handle empty input (should reject)
- Handle characters not in database (should reject)
- Verify score precision rounding

### 2.2 Weight Calculation (`services/analysis/weight.service.test.ts`)
- Apply 60/40 weight split (First Name / Surname)
- Apply custom weight split (50/10/30/10)
- Validate total weight equals 100%
- Reject save when total weight != 100%
- Missing field: REDISTRIBUTE_WEIGHT policy
- Missing field: SKIP policy

### 2.3 Entitlement Logic (`services/subscription/entitlement.service.test.ts`)
- User with free credits can analyze (FIRST_NAME)
- User with free credits can analyze (SURNAME)
- User with 0 combined credits cannot run COMBINED analysis
- User with exhausted free credits is blocked
- User with purchased credits can analyze
- Credit balance correctly calculated from ledger

### 2.4 Validation Schemas
- Signup: valid email, password strength, confirm match
- Analysis: valid analysis type, required inputs per type
- Admin settings: weight sum validation

---

## 3. Integration Tests

### 3.1 Authentication (`__tests__/integration/auth.test.ts`)
- Successful signup creates user + allocates free credits
- Duplicate email signup rejected
- Successful signin returns session cookie
- Invalid password rejected
- Signout clears session

### 3.2 Analysis API (`__tests__/integration/analysis.test.ts`)
- Authenticated user can perform FIRST_NAME analysis
- Analysis result includes score, breakdown, interpretation
- Credit consumed after successful analysis
- Second analysis consumes second credit
- Third analysis (beyond free limit) returns 403
- Validation error does NOT consume credit
- Concurrent requests cannot double-spend credits (race condition test)

### 3.3 Stripe Webhook (`__tests__/integration/stripe-webhook.test.ts`)
- Valid webhook signature accepted
- Invalid signature rejected (400)
- checkout.session.completed grants credits correctly
- Duplicate event processed only once (idempotency)
- charge.refunded revokes unused credits

### 3.4 Admin API (`__tests__/integration/admin.test.ts`)
- Non-admin user receives 403 on admin endpoints
- Character score CRUD operations work correctly
- Weight update rejected when sum != 100%
- Admin actions create audit log entries

---

## 4. E2E Tests

### 4.1 Free User Journey (`__tests__/e2e/free-user-journey.spec.ts`)
```
1. Navigate to signup page
2. Register new account
3. Verify redirect to dashboard
4. Verify credit balances shown (2 First Name, 2 Surname, 0 Combined)
5. Navigate to analyze page
6. Submit First Name analysis
7. Verify result page with score and breakdown
8. Submit second First Name analysis
9. Attempt third First Name analysis
10. Verify paywall displayed
11. Verify pricing page link works
```

### 4.2 Purchase Flow (`__tests__/e2e/purchase-flow.spec.ts`)
```
1. Login as user with exhausted free credits
2. Navigate to pricing page
3. Click purchase button
4. Verify redirect to Stripe Checkout (mock in test)
5. Simulate successful webhook
6. Verify credits updated in dashboard
7. Perform analysis with new credits
```

### 4.3 Admin Configuration (`__tests__/e2e/admin-config.spec.ts`)
```
1. Login as admin
2. Navigate to admin dashboard
3. Modify character score
4. Verify new analysis uses updated score
5. Verify historical analysis shows old score (version snapshot)
```

---

## 5. Test Commands

```bash
# Run all unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run integration tests (requires test DB)
npm run test:integration

# Run E2E tests (requires running dev server)
npm run test:e2e

# Run all tests with coverage
npm run test:coverage

# Type check
npm run typecheck
```

---

## 6. Test Database Setup

Integration tests use a separate test database:

```
DATABASE_URL_TEST=postgresql://postgres:postgres@localhost:5432/namenology_test
```

Before integration tests:
1. Reset test database: `npx prisma migrate reset --force`
2. Seed with test data: `npx prisma db seed`

---

## 7. Mocking Strategy

| Dependency | Mock Strategy |
|---|---|
| Prisma Client | Use test database with real Prisma client (no mocking) |
| Stripe API | Mock Stripe SDK responses for unit tests; use Stripe CLI for webhook testing |
| Argon2 | Use real implementation (fast enough for tests with reduced cost params) |
| Environment Variables | Override via test configuration |
