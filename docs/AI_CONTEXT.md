# AI CONTEXT — NAMENOLOGY

> This file is the most critical document for any AI agent joining this project.
> Read this file FIRST before making any changes.

Last Updated: 2026-09-22

---

## Project Overview

Namenology is a production-ready SaaS web application for **name analysis** based on character-level numeric scoring. The system calculates auspicious scores for given names, surnames, and combined name+surname pairs using configurable character mappings, weighted components, and versioned calculation formulas.

The platform also offers professional services: Baby Naming ($150), Name Change ($190), and Surname Creation ($360), handled through a Service Order workflow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS 3.4 with custom theme tokens |
| Icons | `lucide-react` (NO EMOJI — strictly enforced) |
| Validation | Zod |
| Database | PostgreSQL 16 |
| ORM | Prisma (schema, migrations, seed) |
| Auth | Custom (Argon2id hashing, HttpOnly Secure Cookie sessions) |
| Payment | Stripe (Checkout, Webhooks, Customer Portal) |
| Infrastructure | Docker (multi-stage build, non-root user), Docker Compose |
| Testing | Vitest (Unit/Integration), Playwright (E2E) |

---

## Current Architecture

### Application Layers

```
src/
  app/              → Next.js App Router pages & API routes
    (public)/       → Landing page, pricing
    (auth)/         → signin, signup, forgot-password, reset-password
    (dashboard)/    → User dashboard, analyze, analysis-history, subscription, account
    admin/          → Admin dashboard, users, characters, components, settings, audit-logs
    api/            → Route handlers (auth, analysis, stripe, admin, health)

  components/       → React UI components
    ui/             → Button, Input, Card, Badge (reusable primitives)
    layout/         → Navbar, Footer, Sidebar
    auth/           → Auth-specific components
    dashboard/      → Dashboard widgets
    analysis/       → Analysis form, results, breakdown
    subscription/   → Subscription cards, paywall
    admin/          → Admin tables, forms, modals
    charts/         → Score gauges, donut charts

  lib/              → Shared utilities
    auth/           → Session management, password hashing, RBAC middleware
    analysis/       → Scoring engine, normalization, weight calculation
    stripe/         → Stripe client, checkout, webhook handler
    subscription/   → Entitlement checks
    security/       → Rate limiting, input sanitization, headers
    validation/     → Zod schemas
    db/             → Prisma client singleton
    env.ts          → Environment variable validation (Zod)
    utils.ts        → cn() helper (clsx + tailwind-merge)

  services/         → Business logic domain services
    analysis/       → analysis.service.ts, scoring.service.ts, weight.service.ts
    users/          → user.service.ts
    subscription/   → subscription.service.ts, entitlement.service.ts
    admin/          → admin.service.ts

  repositories/     → Data access layer (Prisma queries)
    analysis/
    users/
    subscription/
    admin/

  types/            → TypeScript interfaces and enums
    index.ts        → Role, AnalysisType, CreditType, ProductType, ServiceOrderStatus

prisma/
  schema.prisma     → Database schema
  seed.ts           → Development seed data
  migrations/       → Auto-generated migration files
```

### Design Pattern

- **Service-Repository Pattern**: Business logic lives in `services/`, database queries in `repositories/`
- **Configuration-Driven**: Character scores, weights, free limits, products, and interpretations are stored in the database, not hard-coded
- **Server-Side Authority**: All authorization, entitlement checks, and payment verification happen on the server. Client state is for UI convenience only

---

## Database Structure

Core tables (see `docs/DATABASE.md` for full schema):

- `users` — Identity and authentication
- `sessions` — Server-side session management
- `name_components` — Configurable analysis components (First Name, Surname, etc.) with weights
- `character_scores` — Per-character numeric mappings (Thai + English, Unicode)
- `analysis_configs` — Versioned system configuration (free limits, score precision, policies)
- `score_interpretations` — Score range to meaning mappings
- `analyses` — Completed analysis records with version snapshots
- `analysis_components` — Per-component breakdown for each analysis
- `analysis_character_details` — Per-character breakdown for each analysis
- `products` — Product catalog (analysis packages + professional services)
- `product_entitlements` — Credits granted per product (FIRST_NAME, SURNAME, COMBINED)
- `credit_ledger` — Auditable credit transaction history
- `orders` — Payment/purchase records
- `service_orders` — Professional service request workflow
- `stripe_webhook_events` — Idempotent webhook event processing
- `admin_audit_logs` — Administrative action audit trail
- `rate_limit_entries` — Rate limiting state

---

## Important Business Rules

1. **Separate Credit Types**: The system maintains independent entitlements for `FIRST_NAME`, `SURNAME`, and `COMBINED`. These are NOT interchangeable.
2. **Free Quota**: New users receive 2 First Name + 2 Surname + 0 Combined credits. Configurable by Admin.
3. **Combined Analysis**: Requires its own dedicated credit. Free plan users cannot access Combined Analysis.
4. **Credit Consumption**: Only successful analyses consume credits. Validation errors, server errors, and failed transactions do NOT consume quota.
5. **Race Condition Prevention**: Credit reservation uses database transactions with row-level locking to prevent multi-tab/concurrent request exploits.
6. **Formula Versioning**: Every analysis stores a `calculation_version` and configuration snapshot. Historical results remain reproducible even when Admin changes scoring rules.
7. **No Hard-Coded Business Logic**: Character scores, weights, free limits, products, prices, and interpretations are all database-driven and Admin-configurable.

---

## Authentication Flow

1. User signs up with Name, Email, Password, Confirm Password
2. Password hashed with Argon2id (salt, time/memory cost configured)
3. Session created as HttpOnly, Secure, SameSite cookie
4. Free credits automatically allocated (2 First Name, 2 Surname, 0 Combined)
5. Protected routes verified server-side via middleware
6. Role-based access: `USER` for dashboard, `ADMIN` for admin panel
7. Server always re-validates role — never trust client-side role state

---

## Stripe Flow

```
User selects package → Server creates Checkout Session (using DB product's stripe_price_id)
→ Stripe Checkout → Payment → Stripe sends Webhook → Server verifies signature
→ Idempotency check via stripe_webhook_events table → Grant credits to credit_ledger
→ Create order record → User gains entitlements
```

Key rules:
- Browser redirect from Stripe does NOT equal payment success
- Credits granted ONLY after verified webhook confirmation
- Stripe Price ID is the source of truth for actual charges
- Frontend never specifies payment amounts

---

## Analysis Algorithm

```
Input → Unicode Normalize (NFC) → Trim whitespace → Validate characters
→ Look up character scores from DB → Calculate component score (sum/count)
→ Apply weight (from name_components table) → Handle missing optional fields
→ Final weighted score → Normalize to 1-100 → Map to interpretation from DB
→ Store with calculation_version snapshot
```

---

## Security Rules

- Argon2id password hashing (no plaintext storage)
- HttpOnly + Secure + SameSite cookies for sessions
- Server-side authorization on every protected endpoint
- Rate limiting on auth, analysis, Stripe, and admin endpoints
- Stripe webhook signature verification + idempotency
- Parameterized queries via Prisma (no raw SQL concatenation)
- Security headers: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options
- No logging of passwords, tokens, secrets, or raw personal data
- Dependency auditing via `npm audit`

---

## Completed Implementation (Phases 1 - 12 Complete)

- [x] **Phase 1: Project Scaffolding & Setup**: Next.js 14 App Router, TypeScript Strict, Tailwind CSS design system with custom bioluminescent palette, Lucide icons, Docker, Zod env validation
- [x] **Phase 2: Comprehensive Documentation**: 14 specification files in `docs/` covering requirements, architecture, API, testing, security, and operations
- [x] **Phase 3: Database Design & Prisma Schema**: 18 PostgreSQL models in `prisma/schema.prisma` with comprehensive seed data for characters, components, products, formula configurations, and interpretations
- [x] **Phase 4: Authentication & Session System**: Argon2id password hashing, database-backed sessions, HttpOnly secure cookies, server-side RBAC middleware, and brute-force rate limiting
- [x] **Phase 5: Core Namenology Analysis Engine**: Unicode NFC normalization, case-insensitive character mapper, dynamic component weights, missing field redistribution (`REDISTRIBUTE_WEIGHT`), 1-100 scaling, and formula snapshotting
- [x] **Phase 6: Entitlement & Credit Ledger**: Atomic DB transactions, row-level locking preventing double-spend, independent quota buckets (First Name, Surname, Combined), and initial free allowance allocation (2/2/0)
- [x] **Phase 7: Stripe Payment, Subscriptions & Products**: Dynamic product catalog ($19, $24, $45, $65 packages; $150, $190, $360 services), raw signature webhook verification, idempotency enforcement, and refund credit revocation
- [x] **Phase 8: User Experience, Dashboard & Analysis UI**: Modern Mystic SaaS landing page (`/`), custom circular SVG `ScoreGauge.tsx`, dual-mode analysis form (Single & Harmonic Pairing), shareable & printable reports (`/analyze/result/[id]`), history page with CSV export (`/analysis-history`), and professional services intake & order tracking (`/services/[code]`)
- [x] **Phase 9: Admin Dashboard & Configuration Center**: Strict server-side RBAC guard (`requireAdmin()`), real-time KPI overview, character score editor, dynamic weight manager with 100.00% sum validation, formula version bump manager, product catalog manager, bespoke service order workbench, and audit log viewer
- [x] **Phase 10: Security Hardening & Rate Limiting (OWASP Compliance)**: Strict CSP, HSTS, X-Content-Type-Options, Permissions-Policy, multi-tier sliding-window rate limiter (`src/lib/security/rate-limiter.ts`), anti-XSS sanitizer (`src/lib/security/sanitize.ts`), structured logger with recursive credential & payment redaction (`src/lib/logger.ts`), and CSRF origin verification
- [x] **Phase 11: Testing & Quality Assurance**: Vitest unit and integration test runner (24/24 tests passed), E2E user journey lifecycle simulation (23/23 tests passed), security test suite (18/18 tests passed), and TypeScript typecheck (0 errors)
- [x] **Phase 12: Production Readiness, Docker Verification & AI Handoff**: Multi-stage Alpine Dockerfile with Alpine Prisma client generation, non-root runner, npm audit review, and complete architectural handoff documentation

## Known Bugs & Production Readiness Status

- Known Bugs: 0
- Typecheck Errors: 0
- Build Compilation Errors: 0
- All business rules, character scores, and product prices are strictly database-driven (zero hardcoded values in UI)

- None currently

---

## Development Commands

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build (standalone output)
npm run start        # Start production server
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
docker compose up -d # Start app + PostgreSQL containers
```

---

## Environment Variables

See `.env.example` for complete list. Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Session signing secret (>= 32 chars) |
| `NEXT_PUBLIC_APP_URL` | Application base URL |
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client-side key |

---

## Important Decisions

See `docs/DECISIONS.md` for full Architecture Decision Records.

Key decisions made so far:
1. Custom auth over NextAuth — for full control over Argon2id hashing and session management
2. Service-Repository pattern — separation of business logic from data access
3. Credit Ledger model — auditable transaction history over simple counter fields
4. Configuration-driven architecture — all business rules stored in DB, not code
5. Formula versioning — immutable snapshots for historical reproducibility
