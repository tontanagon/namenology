# ARCHITECTURE — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. System Architecture Overview

Namenology uses a **layered architecture** with clear separation of concerns:

```
┌──────────────────────────────────────────────────┐
│                   Client (Browser)               │
│         Next.js React Components (TSX)           │
│  Server Components + Client Components as needed │
└────────────────────────┬─────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────┐
│              Next.js App Router                   │
│     Route Handlers (API) + Server Actions         │
│     Middleware (Auth, Rate Limit, RBAC)            │
└────────────────────────┬─────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────┐
│               Service Layer                       │
│   analysis.service  │  user.service               │
│   scoring.service   │  subscription.service       │
│   weight.service    │  entitlement.service         │
│   admin.service     │  stripe.service              │
└────────────────────────┬─────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────┐
│             Repository Layer                      │
│     Prisma queries with transactions              │
│     Row-level locking for credit operations       │
└────────────────────────┬─────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────┐
│              PostgreSQL 16                        │
│   Users, Sessions, Analyses, Credits, Products,   │
│   Service Orders, Audit Logs, Webhook Events      │
└──────────────────────────────────────────────────┘
```

---

## 2. Layer Responsibilities

### Presentation Layer (`src/app/`, `src/components/`)
- Next.js App Router pages and layouts
- React Server Components for data fetching (no client JS overhead)
- React Client Components only where interactivity is required (`"use client"`)
- Reusable UI primitives in `components/ui/`
- Domain-specific components in `components/analysis/`, `components/admin/`, etc.

### API / Route Handler Layer (`src/app/api/`)
- HTTP request/response handling
- Input validation with Zod schemas
- Authentication verification
- Role-based authorization
- Delegates to Service Layer for business logic

### Middleware Layer (`src/middleware.ts`, `src/lib/auth/`, `src/lib/security/`)
- Route protection (redirect unauthenticated users)
- Admin route guarding (server-side role check)
- Rate limiting enforcement
- Security header injection

### Service Layer (`src/services/`)
- Business logic and orchestration
- No direct DB queries — delegates to Repository Layer
- Transaction coordination
- Entitlement verification before analysis execution
- Stripe session creation and webhook processing

### Repository Layer (`src/repositories/`)
- Raw Prisma queries
- Database transaction management
- Atomic operations (credit reservation + analysis creation)
- Query optimization (includes, selects, pagination)

### Domain Types (`src/types/`)
- TypeScript interfaces and type aliases
- Shared across all layers
- Enum-like union types: `Role`, `AnalysisType`, `CreditType`, `ProductType`

---

## 3. Key Data Flows

### 3.1 Analysis Request Flow

```
Client POST /api/analysis
  → Authenticate (verify session cookie)
  → Authorize (check user role)
  → Validate input (Zod schema)
  → Check entitlement (service: canAnalyze(userId, analysisType))
  → Reserve credit atomically (repository: DB transaction + row lock)
  → Normalize input (Unicode NFC, trim whitespace)
  → Look up character scores (repository: from character_scores table)
  → Calculate component score (service: scoring.service)
  → Apply weights (service: weight.service)
  → Normalize to 1-100 (service: scoring.service)
  → Resolve interpretation (repository: from score_interpretations table)
  → Store analysis with calculation_version snapshot (repository)
  → Consume credit in ledger (repository: within same transaction)
  → Return result to client
```

### 3.2 Stripe Payment Flow

```
Client → POST /api/stripe/checkout (with productId)
  → Server loads product from DB
  → Server validates product is active
  → Server retrieves stripe_price_id from product record
  → Server creates Stripe Checkout Session
  → Client redirects to Stripe

Stripe → POST /api/stripe/webhook
  → Extract raw body
  → Verify Stripe signature
  → Check idempotency (stripe_webhook_events table)
  → Process event:
    - checkout.session.completed → Create order, grant credits to ledger
    - customer.subscription.updated → Sync subscription status
    - charge.refunded → Revoke unused credits
  → Mark event as processed
```

### 3.3 Admin Configuration Change Flow

```
Admin → PATCH /api/admin/characters/:id (or components, settings)
  → Authenticate + Authorize (role=ADMIN)
  → Validate input
  → Apply change in DB
  → If scoring-related: increment calculation version
  → Write audit log entry
  → Return updated resource
```

---

## 4. Configuration-Driven Architecture

The following business values are stored in the database and configurable by Admin without code deployment:

| Configuration | Table | Impact |
|---|---|---|
| Character scores | `character_scores` | Scoring calculation |
| Name component weights | `name_components` | Weight distribution |
| Free analysis limits | `analysis_configs` | Entitlement |
| Score precision | `analysis_configs` | Display formatting |
| Missing field policy | `analysis_configs` | Weight redistribution |
| Product prices & credits | `products`, `product_entitlements` | Checkout & entitlement |
| Score interpretations | `score_interpretations` | Result display |
| Service availability | `products` | Service catalog |

---

## 5. Security Architecture

```
Request
  → Security Headers (CSP, HSTS, X-Frame-Options) [next.config.mjs]
  → Rate Limiter [middleware / lib/security]
  → Session Validation [lib/auth]
  → Role Authorization [lib/auth]
  → Input Validation [Zod schemas]
  → Parameterized Queries [Prisma ORM]
  → Structured Logging (sensitive data redacted) [lib/security]
```

---

## 6. Docker Architecture

```
docker-compose.yml
  ├── app (Next.js)
  │   ├── Multi-stage build (deps → builder → runner)
  │   ├── Non-root user (nextjs:nodejs, uid 1001)
  │   ├── Standalone output mode
  │   └── Depends on db (healthcheck)
  │
  └── db (PostgreSQL 16 Alpine)
      ├── Persistent volume (postgres_data)
      ├── Healthcheck (pg_isready)
      └── Isolated network
```

---

## 7. Component Architecture

UI components follow atomic design principles with strict separation:

```
components/
  ui/           → Generic, stateless primitives (Button, Input, Card, Badge)
  layout/       → App shell (Navbar, Footer, Sidebar, DashboardLayout)
  auth/         → Login/signup specific
  dashboard/    → Dashboard widgets and cards
  analysis/     → AnalysisForm, AnalysisResult, ScoreBreakdown, CharacterBreakdown
  subscription/ → PricingCard, Paywall, SubscriptionStatus
  admin/        → AdminSidebar, DataTable, CharacterScoreForm, AuditLogTable
  charts/       → DonutChart, ProgressBar, ScoreGauge
```

Rules:
- No heavy business logic inside React components
- Calculation logic lives in `services/` and `lib/`
- Components receive data via props or server component data fetching
- Client Components (`"use client"`) only for interactive elements (forms, modals, toggles)
