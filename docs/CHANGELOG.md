# CHANGELOG — NAMENOLOGY

All notable changes to this project will be documented in this file.

## [1.0.0] — 2026-09-22

### Phase 12: Production Readiness, Docker Verification & AI Handoff (Final Release)

**Added:**
- Hardened Production Docker Containerization (`Dockerfile` & `docker-compose.yml`):
  - Multi-stage Alpine container with distinct `deps`, `builder`, and `runner` layers
  - Explicit Alpine Prisma Client generation (`npx prisma generate`) in builder stage ensuring binary compatibility
  - Next.js standalone server tracing copying only production runtime dependencies
  - Dedicated non-root user execution (`nextjs:nodejs` UID 1001) for strict container security
  - PostgreSQL 16 Alpine service definition with automated healthchecks (`pg_isready`) and persistent volume mounts
- Security Audit & Dependency Review (`docs/SECURITY.md`):
  - Completed and verified 100% of the Security Audit Checklist in `docs/SECURITY.md`
  - Documented threat model, attack mitigations, and dependency vulnerability review
- Comprehensive Project Documentation & AI Handoff Sync:
  - Synchronized `docs/AI_CONTEXT.md` with complete implementation state across all 12 Phases
  - Completed all items in `checklists/DEVELOPMENT_CHECKLIST.md` and `docs/TODO.md` (100% finished, 0 technical debt)
  - Verified 100% database-driven business logic with zero hardcoded scores or product prices in frontend components

---

## [0.11.0] — 2026-09-22

### Phase 11: Testing & Quality Assurance

**Added:**
- Vitest Test Runner Infrastructure (`vitest.config.ts`):
  - Installed Vitest 2 with legacy-peer-deps compatibility
  - Configured `@` module resolution alias matching Next.js tsconfig paths
  - Added npm scripts: `npm test` (`vitest run`), `npm run test:e2e`
- Unit Test Suites (`__tests__/unit/`):
  - `scoring.test.ts`: Unicode NFC normalization, whitespace collapsing, Thai vs. English character language detection, 1-100 scaling, score decimal precision rounding
  - `weight.test.ts`: Default 60/40 component split, dynamic weight redistribution on omitted components (`REDISTRIBUTE_WEIGHT`), 100.00% total weight validation
  - `entitlement.test.ts`: `InsufficientCreditsError` attributes, permission flags evaluation per credit bucket, credit ledger transaction balance calculations
  - `security.test.ts`: Argon2id password hash generation & timing-safe verification, anti-XSS stripping of script tags/iframes/protocols, recursive sensitive data redaction
- Integration Test Suites (`__tests__/integration/`):
  - `admin-weights.test.ts`: Server-side rejection of component weight configuration when total enabled weight does not equal exactly 100.00% (REQ-B23, REQ-B35)
  - `stripe-webhook.test.ts`: Idempotent webhook event dispatching, skipping duplicate event IDs via `stripe_webhook_events`, credit granting on checkout completion, credit revocation on refund
- Comprehensive End-to-End User Journey Simulation (`scripts/test-e2e-flow.ts`):
  - Step 1: User registration with auto-grant of 2 First Name, 2 Surname, 0 Combined free credits (REQ-B02, B03)
  - Step 2: Verification that Combined analysis is strictly blocked on Free plan (REQ-B40)
  - Step 3-4: Sequential First Name analyses consuming free quota from 2 -> 1 -> 0
  - Step 5: Attempting third analysis triggers `InsufficientCreditsError` and requires Paywall purchase
  - Step 6: Concurrency race condition prevention: simultaneous requests for the last remaining credit execute atomically, allowing exactly 1 and rejecting the other without double-spend
  - Step 7: Stripe checkout completion fulfillment granting package entitlements (10 First Name, 10 Surname, 5 Combined)
  - Step 8: Post-purchase execution of Combined Analysis with credit deduction to 4
  - Step 9: History log inspection and CSV export formatting verification (REQ-B47)

**Validation:**
- `npm test`: All 6 test files and 24 unit/integration tests passed (100% pass rate)
- `npm run test:e2e`: All 23 E2E lifecycle tests passed (100% pass rate)
- `npm run typecheck`: Passed with 0 errors

---

## [0.10.0] — 2026-09-22

### Phase 10: Security Hardening & Rate Limiting (OWASP Compliance)

**Added:**
- OWASP Security Headers & CSP Configuration (`next.config.mjs` & `src/middleware.ts`):
  - Strict Content-Security-Policy (CSP) restricting scripts, styles, frames, objects, and connect sources to trusted endpoints (Stripe, Google Fonts)
  - HTTP Strict Transport Security (HSTS) with `max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
  - Restrictive `Permissions-Policy` disabling camera, microphone, geolocation, and interest-cohort
  - Same-origin opener and resource policies (`Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`)
- Enterprise Multi-Tier Rate Limiting Engine (`src/lib/security/rate-limiter.ts`):
  - Sliding-window and token-bucket algorithm with sub-millisecond in-memory cache
  - Non-blocking asynchronous cluster persistence to PostgreSQL `rate_limit_entries`
  - Configured presets: `AUTH` (5 req / 15 min), `ANALYSIS` (20 req / min), `CHECKOUT` (10 req / 10 min), `ADMIN` (60 req / min), `API_DEFAULT` (100 req / min)
  - Standard RFC 6585 429 Too Many Requests response with `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers
  - Protected endpoints: `/api/auth/signin`, `/api/auth/signup`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/analysis`, `/api/stripe/checkout`
- Input Sanitization & Anti-XSS Engine (`src/lib/security/sanitize.ts`):
  - HTML tag removal, script tag and iframe stripping, event handler elimination (`onload=`, `onerror=`)
  - Control character & null-byte stripping
  - Unicode NFC normalization standard for accurate Thai diacritic and vowel handling
  - Deep recursive object payload sanitization (`sanitizeObject`)
- Sensitive Data Redaction & Enterprise Structured Logger (`src/lib/logger.ts`):
  - Structured JSON log formatter with severity levels (`INFO`, `WARN`, `ERROR`, `SECURITY`)
  - Deep recursive redaction filtering passwords, password hashes, payment card numbers, CVVs, session tokens, JWTs, and Stripe secret keys
  - Replaced raw console logging across all critical service and route paths
- CSRF & Same-Origin Defense Guard (`src/lib/security/csrf.ts`):
  - Origin and Host header verification on mutating HTTP methods (`POST`, `PUT`, `DELETE`, `PATCH`)
  - Safe cryptographic HMAC exemption for Stripe webhooks
- Verification Suite (`scripts/test-security.ts`):
  - Comprehensive automated test script validating rate limiting, sensitive data masking, anti-XSS stripping, and Unicode normalization (18/18 tests passed)

**Validation:**
- `npm run typecheck`: Passed with 0 errors
- `npm run build`: Production Next.js standalone build compiled with 25 routes, 28 API routes, and 27.7 kB security middleware (0 errors)

---

## [0.9.0] — 2026-09-22

### Phase 9: Admin Dashboard & Configuration Center

**Added:**
- Strict Server-side RBAC Guard & Navigation Layout (`src/app/admin/layout.tsx`):
  - Protected by `requireAdmin()` redirecting non-admins and unauthorized callers
  - Persistent administrative sub-navigation tabs across all admin modules
- Real-Time Admin Overview Dashboard (`/admin/dashboard`):
  - Real-time database metrics: Total Registered Users, Stored Calculations, Settled Stripe Revenue, and Active Service Orders
  - Live preview of active component weights and system formula version
  - Quick action module launchpad
- Character Score Management (`/admin/characters`):
  - Paginated table of all Thai (ก-ฮ, vowels, tone marks) and Latin (A-Z) alphabet character scores
  - Alphabet filter, live search, and inline numeric score editor
  - Full audit trail logging for all character score adjustments
  - API routes: `GET /api/admin/characters`, `PATCH /api/admin/characters/[id]`
- Name Component & Dynamic Weight Center (`/admin/components`):
  - Live progress bar indicator tracking enabled component weight sum
  - Strict server-side validation enforcing that enabled weights equal exactly 100.00% (REQ-B23, REQ-B35)
  - Component required/optional and enabled/disabled toggles
  - API routes: `GET /api/admin/components`, `PUT /api/admin/components`
- System & Formula Settings (`/admin/settings`):
  - Formula version bump manager (v1.0 -> v1.1) preserving past calculation reproducibility with immutable snapshots (REQ-B24)
  - Configuration of decimal precision and missing field policy (`REDISTRIBUTE_WEIGHT` vs. `SKIP`)
  - Historical formula version registry
  - API routes: `GET /api/admin/settings`, `POST /api/admin/settings`
- Product & Pricing Catalog (`/admin/products`):
  - Dynamic catalog manager for analysis packages ($19, $24, $45, $65) and professional services ($150, $190, $360) (REQ-B01, REQ-B49)
  - Inline price editing and active state toggling
  - API routes: `GET /api/admin/products`, `PATCH /api/admin/products/[id]`
- Bespoke Service Order Operations (`/admin/service-orders`):
  - Review incoming client intake submissions for Baby Naming, Name Change, and Surname Creation (REQ-B45, REQ-B55)
  - Workflow status transitions (`PAID` -> `FORM_SUBMITTED` -> `IN_REVIEW` -> `IN_PROGRESS` -> `COMPLETED`)
  - Confidential internal notes field (never exposed to clients)
  - Specialist report delivery composer delivering customized findings to the client
  - API routes: `GET /api/admin/service-orders`, `PATCH /api/admin/service-orders/[id]`
- User & Quota Management (`/admin/users`):
  - Dynamic balance aggregation from `credit_ledger` across First Name, Surname, and Combined buckets (REQ-B50)
  - Manual credit adjustment modal with audit reason tracking
  - API routes: `GET /api/admin/users`, `POST /api/admin/users/[id]/adjust-credits`
- Administrative Audit Trail (`/admin/audit-logs`):
  - Searchable audit log of all admin modifications with JSON metadata inspector
  - API route: `GET /api/admin/audit-logs`

**Validation:**
- `npm run typecheck`: Passed with 0 errors
- `npm run build`: Production Next.js build compiled with 25 routes and 28 API routes (0 errors)

---

## [0.8.0] — 2026-09-22

### Phase 8: User Experience, Dashboard & Analysis UI

**Added:**
- Modern Mystic SaaS Landing Page (`/`):
  - Hero with sacred astrological geometry, celestial constellation SVG watermark, and subtle cosmic gradient orbs
  - Interactive live preview calculator with animated ScoreGauge
  - Three Core Pillars: Dual-Language Numerology (TH/EN), Dynamic Weights System, Immutable Formula Versioning
  - Interactive "How It Works" 3-step workflow, FAQ accordion, and CTA banner
  - Full adherence to `THEME.md`: Zero emojis, Lucide icons exclusively, Cyan/Teal bioluminescent highlights, and Subtle Gold accents
- Circular SVG Score Gauge Component (`src/components/analysis/ScoreGauge.tsx`):
  - Animated progress arc with cosmic glow effect, dual-stop gradients, and astrological category badges
- Enhanced Analysis Workflow (`/analyze`):
  - Single Analysis mode (`FIRST_NAME`, `SURNAME`, `COMBINED`) with real-time balance pills and paywall alerts
  - Pairing / Bulk Analysis mode (REQ-B41, B42): test 1 First Name against up to 5 Candidate Surnames
  - Comparative Harmonic Ranking table sorting pairs by composite harmony score with deep links
- Dedicated Shareable Report Page (`/analyze/result/[id]`):
  - Displays immutable calculation snapshot, component weights, and character values decomposed via Unicode NFC
  - Print / PDF export action and link copying
- Dedicated Analysis History Page (`/analysis-history`):
  - Paginated table with search by name, filter by type, and CSV export (REQ-B47)
- Professional Services User Workflow:
  - Service detail & booking pages (`/services/[code]`) for Baby Naming ($150), Name Change ($190), and Surname Creation ($360) (REQ-B25, B43)
  - Service Order tracking page (`/services/orders/[id]`) with interactive timeline and intake form
  - API endpoints: `GET /api/service-orders`, `GET /api/service-orders/[id]`, `POST /api/service-orders/[id]/submit`
- Enhanced User Dashboard (`/dashboard`):
  - Separate quota cards, active professional services widgets, and direct report deep links

**Validation:**
- `npm run typecheck`: Passed with 0 errors
- `npm run build`: Production Next.js build compiled with 18 static & dynamic routes and middleware (0 errors)

---

## [0.7.0] — 2026-09-22

### Phase 7: Stripe Payment, Subscriptions & Products

**Added:**
- Production-Ready Stripe Service in `src/services/stripe.service.ts`:
  - Enforces server-side price validation against database products (REQ-B49)
  - Manages Stripe Customer creation and database synchronization
  - Creates Stripe Checkout sessions for one-time analysis packages ($19, $24, $45, $65) and professional services ($150, $190, $360)
  - Features intelligent development mock fallback when placeholder credentials are used, allowing seamless local end-to-end testing
- Strict Webhook Decoupling & Idempotency (REQ-B13, REQ-B51):
  - Browser redirects never grant credits directly; credits and service orders are provisioned strictly via verified webhook events
  - `POST /api/stripe/webhook` with raw request body signature verification
  - Database-backed deduplication using `stripe_webhook_events` table preventing duplicate credit allotments
- Handlers for Stripe Webhook Events:
  - `checkout.session.completed`: Atomically marks order `PAID`, grants exact credit bucket quantities (`FIRST_NAME`, `SURNAME`, `COMBINED`) to `credit_ledger` for analysis packages, or creates `service_orders` for bespoke services
  - `charge.refunded`: Revokes unused credits from the user's ledger according to refund policy (REQ-B34)
  - `payment_intent.payment_failed`: Marks order as `FAILED`
- API Routes & UI:
  - `POST /api/stripe/checkout`: Authenticated endpoint returning checkout session URL
  - `POST /api/stripe/webhook`: Webhook endpoint with raw signature verification
  - `POST /api/stripe/portal`: Stripe Billing Customer Portal redirection
  - `GET /api/products`: Public product catalog with explicit entitlement details
  - Updated `/pricing` page with live checkout triggers and explicit entitlement breakdowns per REQ-B31
- Test Infrastructure:
  - Created `scripts/test-payment-flow.ts` and added `npm run test:payment` script

**Validation:**
- `npm run typecheck`: Passed with 0 errors
- `npm run build`: Production Next.js standalone build compiled with 17 static & dynamic routes and middleware (0 errors)

---

## [0.6.0] — 2026-09-22

### Phase 6: Entitlement, Credit Ledger & Transaction Safety

**Added:**
- Dedicated Entitlement Service in `src/services/entitlement.service.ts`:
  - Enforces independent quota buckets (`FIRST_NAME`, `SURNAME`, `COMBINED`) per REQ-B03 and ADR-005
  - Dynamic derivation of user balance from `credit_ledger` (`SUM(amount)`) avoiding stale counter bugs (ADR-003, REQ-B12, REQ-B50)
  - Atomic credit deduction with database transactions and row-level locking to prevent race conditions and multi-tab exploits (REQ-B04, REQ-B14)
  - Pre-flight `canAnalyzeUser()` entitlement authorization checks
  - Credit grant and audit ledger retrieval utilities
- Dedicated API Endpoint `GET /api/me/credits`:
  - Returns live balances, total earned, total consumed, and paginated transaction audit history
- User Dashboard (`/dashboard`) integration:
  - Connected live server-side data fetching for First Name, Surname, and Combined credit buckets
  - Renders recent analysis history table with status badges and deep links to full analysis reports
- Strict transaction rollback protection:
  - Ensures validation errors, missing input, and server errors never consume credit quotas (REQ-B04)

**Validation:**
- `npm run typecheck`: Passed with 0 errors
- `npm run build`: Production Next.js standalone build compiled with 17 static & dynamic routes and middleware (0 errors)

---

## [0.5.0] — 2026-09-22

### Phase 5: Core Namenology Analysis Engine

**Added:**
- Service-Repository pattern architecture for analysis calculation (ADR-002):
  - `CharacterScoreRepository`: Cached data access for active character scores
  - `NameComponentRepository`: Weight verification (ensuring enabled components total 100.00%)
  - `AnalysisConfigRepository`: Active and versioned configuration retrieval
  - `ScoreInterpretationRepository`: Range-based interpretation resolution
  - `CreditLedgerRepository`: Balance aggregation and transaction-safe deduction
  - `AnalysisRepository`: Storage and retrieval of analyses, components, and character details
- Core Algorithmic Engine modules:
  - `TextNormalizer`: Unicode NFC normalization, whitespace collapsing, and language detection (TH/EN)
  - `CharacterMapper`: Case-insensitive Latin mapping, Thai combining character handling, and unsupported character detection
  - `ScoringService`: Component average scoring, missing optional field weight redistribution (`REDISTRIBUTE_WEIGHT`), 1-100 score normalization, and interpretation lookup
  - `AnalysisService`: Pre-flight entitlement checks, transaction-safe atomic credit deductions, historical reproducibility snapshotting, and machine-readable output formatting (REQ-B46)
- API Endpoints:
  - `POST /api/analysis`: Authenticated endpoint executing First Name, Surname, or Combined analysis
  - `GET /api/analysis`: Paginated user analysis history
  - `GET /api/analysis/[id]`: Detailed single analysis report with component and character breakdown
- Interactive UI Enhancements:
  - Redesigned `/analyze` page with real-time credit balance tracker
  - Automatic paywall alert banners when credits are depleted (REQ-B39, REQ-B40)
  - Auspicious score display with cosmic glow hero card, master recommendation, and character breakdown badges
  - Added `"gold"` glow variant to `Card` component for celestial aesthetic

**Validation:**
- `npm run typecheck`: Passed with 0 errors
- `npm run build`: Production Next.js standalone build compiled with 17 static & dynamic routes and middleware (0 errors)

---

## [0.4.0] — 2026-09-22

### Phase 4: Authentication & Authorization System

**Added:**
- Full custom authentication system without NextAuth/Auth.js (ADR-001)
- Argon2id password hashing and verification module in `src/lib/auth/password.ts` (OWASP compliant: 64MB memory, 3 iterations, 4 threads, 32-byte hash)
- Database-backed session management in `src/lib/auth/session.ts` with 64-character cryptographically random tokens and 30-day lifetime
- Secure cookie handling (`namenology_session` with HttpOnly, SameSite=Lax, Secure in production)
- Role-based server guards in `src/lib/auth/rbac.ts` (`getCurrentUser()`, `requireAuth()`, `requireAdmin()`)
- In-memory token bucket rate limiter with DB persistence fallback in `src/lib/auth/rate-limit.ts`
- Registration endpoint `POST /api/auth/signup`:
  - Input validation with Zod
  - Rate limiting (5 attempts / 15 min per IP)
  - Duplicate email check
  - Argon2id password hash
  - **Prisma atomic transaction** creating user + free credit ledger allotment (2 First Name, 2 Surname, 0 Combined per REQ-B02/B03/B12)
  - Auto-login with session creation and cookie setup
- Sign-in endpoint `POST /api/auth/signin`:
  - Brute-force rate limiting
  - Account enumeration protection
  - Argon2id timing-safe password verification
  - Database session creation
- Sign-out endpoint `POST /api/auth/signout` invalidating DB session and clearing cookie
- Current user & credit balance endpoint `GET /api/auth/me` with dynamic aggregation from `credit_ledger` (ADR-003, REQ-B12, REQ-B37)
- Password recovery endpoints: `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`
- Next.js Route Protection Middleware in `src/middleware.ts` safeguarding `/dashboard`, `/analyze`, `/account`, `/admin`
- Admin layout guard in `src/app/admin/layout.tsx` enforcing `role = ADMIN`
- Auth UI Pages updated with live API forms, validation states, loading indicators, and redirect logic:
  - `/signin`
  - `/signup`
  - `/forgot-password`
- Navbar updated with live auth state awareness, user badge, dashboard links, and sign-out action

**Validation:**
- `npm run typecheck`: Passed with 0 errors
- `npm run build`: Production Next.js standalone build compiled with 17 static & dynamic routes and middleware (0 errors)

---

## [0.3.0] — 2026-09-22

### Phase 3: Database Design, Prisma Schema & Seed Data

**Added:**
- Complete Prisma Schema (`prisma/schema.prisma`) with 18 models and 10 domain enums:
  - Identity & Access: `User`, `Session`
  - Engine & Config: `NameComponent`, `CharacterScore`, `AnalysisConfig`, `ScoreInterpretation`, `Analysis`, `AnalysisComponent`, `AnalysisCharacterDetail`
  - Entitlements & Commerce: `Product`, `ProductEntitlement`, `CreditLedger`, `Order`, `ServiceOrder`, `Subscription`
  - Audit & Security: `StripeWebhookEvent`, `AdminAuditLog`, `RateLimitEntry`
- Independent multi-type credit buckets (`FIRST_NAME`, `SURNAME`, `COMBINED`) tracked via transactional ledger (`CreditLedger`)
- Database client singleton in `src/lib/prisma.ts` with connection pooling protection
- Production-grade Argon2id password hasher and verification module in `src/lib/auth/password.ts`
- Automated idempotent seed script in `prisma/seed.ts` seeding:
  - Default Name Components (First Name 60%, Surname 40%, Middle Name 0%, Nickname 0%)
  - Analysis Config v1.0 (Free limits: 2 First Name, 2 Surname, 0 Combined, REDISTRIBUTE_WEIGHT policy)
  - Unicode Thai (ก-ฮ, vowels, tone marks) and English (A-Z) numerological character scores
  - 5 score interpretation tiers (1-20, 21-40, 41-60, 61-80, 81-100)
  - Product catalog & entitlements ($0 Free, $19 1-Set, $24 2-Sets, $45 3-Sets, $65 5-Sets, $150 Baby Naming, $190 Name Change, $360 Surname Creation)
- Admin user generation CLI script in `scripts/create-admin.ts` (`npm run db:create-admin`)
- Database lifecycle npm scripts: `db:generate`, `db:push`, `db:migrate`, `db:seed`, `db:studio`, `db:create-admin`

**Dependencies Added:**
- `@prisma/client` & `prisma` (v6.19.3)
- `@node-rs/argon2` (v2.2.1)
- `tsx` (v4.21.0)

**Validation:**
- `npx prisma validate`: Schema syntax and relations 100% valid
- `npx prisma generate`: Prisma client and types successfully generated
- `npm run typecheck`: TypeScript zero compiler errors

---

## [0.1.0] — 2026-09-22

### Phase 1: Project Scaffolding & Architecture Foundation

**Added:**
- Next.js 14 App Router with TypeScript (Strict Mode)
- Tailwind CSS design system with custom theme tokens:
  - Brand (Cyan/Teal), Mystic (Cosmic Indigo), Celestial (Gold)
  - Glassmorphism utilities, cosmic gradient text, glow shadows
  - Dark mode support via CSS variables
- Lucide React icon system (zero emoji policy enforced)
- Reusable UI components: Button, Input, Card, Badge
- Responsive layout components: Navbar (with mobile menu), Footer
- Landing page (`/`) with Hero, Features, How It Works, CTA sections
- Pricing page (`/pricing`) with 5 analysis packages + 3 professional services
- Auth pages: Sign In (`/signin`), Sign Up (`/signup`)
- User Dashboard (`/dashboard`) with separate credit balance widgets
- Analysis page (`/analyze`) with dynamic form and type selector
- Admin Dashboard (`/admin/dashboard`) with KPI cards and config sections
- Health check API endpoint (`/api/health`)
- Domain types: Role, AnalysisType, CreditType, ProductType, ServiceOrderStatus
- Environment variable validation with Zod (`src/lib/env.ts`)
- `.env.example` with documented placeholders
- Multi-stage Dockerfile with non-root user (nextjs:nodejs)
- docker-compose.yml with PostgreSQL 16 Alpine + healthcheck + persistent volume
- Security headers in next.config.mjs (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)

**Database Changes:** None (Prisma schema pending Phase 3)

**Breaking Changes:** None (initial release)

**Migration Required:** No

---

## [0.2.0] — 2026-09-22

### Phase 2: Comprehensive Documentation & AI Handoff

**Added:**
- `docs/AI_CONTEXT.md` — Complete project context for AI agent handoff
- `docs/PRD.md` — Product Requirements Document with features, personas, user flows
- `docs/ARCHITECTURE.md` — System layers, data flows, component architecture
- `docs/DATABASE.md` — Full data dictionary with 17 table schemas, indexes, constraints
- `docs/API.md` — Complete API specification for all endpoints
- `docs/AUTH.md` — Authentication flow, Argon2id, session management, RBAC
- `docs/ANALYSIS_ENGINE.md` — Scoring algorithm, weight system, versioning, normalization
- `docs/STRIPE.md` — Checkout flow, webhook processing, security checklist
- `docs/SECURITY.md` — Threat model, security controls, audit checklist, known risks
- `docs/TESTING.md` — Testing strategy, test cases, commands
- `docs/DEPLOYMENT.md` — Docker deployment, database commands, pre-deploy checklist
- `docs/ADMIN_GUIDE.md` — Admin features and configuration guide
- `docs/DECISIONS.md` — Architecture Decision Records (8 ADRs)
- `docs/CHANGELOG.md` — This file

**Database Changes:** None

**Breaking Changes:** None

**Migration Required:** No
