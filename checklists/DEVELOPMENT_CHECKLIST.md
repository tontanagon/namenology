# NAMENOLOGY — MASTER DEVELOPMENT CHECKLIST
> ระบบวิเคราะห์ชื่อและบริการตั้งชื่อแบบครบวงจร (Production-Ready SaaS)
> อ้างอิงตามข้อกำหนด: `PROJECT_SPEC.md`, `Namenology_Business_Specification.md`, และ `THEME.md`

---

## สรุปภาพรวมสถาปัตยกรรมและเทคโนโลยี (Architecture & Tech Stack)
* **Frontend / Full Stack:** Next.js (App Router), TypeScript (Strict Mode), Tailwind CSS, Shadcn UI / Radix Primitives
* **Design & Theme:** สไตล์ "Modern SaaS 2026" + Mystic / Cosmic Astrology (Cyan/Teal Accent, Indigo/Gold, Clean White & Dark Mode, Glassmorphism, **ห้ามใช้ Emoji — ใช้ SVG/Icon Placeholder**)
* **Database & ORM:** PostgreSQL + Prisma ORM (Migrations, Indexes, Seed data)
* **Authentication:** Password Hashing (Argon2id), Session Cookie (HttpOnly, Secure, SameSite), Role-Based Access Control (`USER`, `ADMIN`)
* **Payment & Subscriptions:** Stripe Checkout, Stripe Webhook (Signature Verification + Idempotency), Stripe Customer Portal
* **Infrastructure:** Docker (Multi-stage build, non-root user), Docker Compose (PostgreSQL, App, Healthchecks)
* **Testing & Security:** Unit, Integration, E2E Tests, Rate Limiting, OWASP Security Standards, Structured Logging

---

## PHASE 1: Project Scaffolding & Architecture Foundation
- [x] **1.1 Next.js & TypeScript Setup**
  - [x] Initialize Next.js project with App Router, TypeScript (Strict Mode), ESLint, Prettier
  - [x] Setup path aliases (`@/components`, `@/lib`, `@/services`, `@/repositories`, `@/types`)
  - [x] Create folder structure according to section 58 of `PROJECT_SPEC.md`
- [x] **1.2 Design System & Styling (ตาม THEME.md)**
  - [x] Setup Tailwind CSS with Custom Theme Tokens:
    - [x] Accent: Cyan/Teal (`Blue Sky Thinking`)
    - [x] Mystic Accents: Deep Cosmic Indigo, Subtle Gold, Clean White background
    - [x] Glassmorphism utility classes & smooth hover micro-interactions
  - [x] Typography setup: Modern Sans-serif (Inter / Roboto / Outfit)
  - [x] Icon System setup (Lucide Icons / Custom SVG) — **ห้ามใช้ Emoji ทุกจุดในระบบ**
  - [x] Setup Base UI Components (Button, Input, Card, Modal, Table, Toast, Badge, Tabs)
- [x] **1.3 Environment & Config Architecture**
  - [x] Create `.env.example` with detailed comments (No real secrets committed)
  - [x] Implement environment variable schema validation using Zod (`lib/env.ts`)
- [x] **1.4 Docker Infrastructure Setup**
  - [x] Multi-stage `Dockerfile` (deps, builder, runner with non-root node user)
  - [x] `docker-compose.yml` (App service, PostgreSQL service with healthcheck & volume persistency)
  - [x] `.dockerignore`

---

## PHASE 2: Comprehensive Documentation & AI Handoff
- [x] **2.1 Core AI & System Context**
  - [x] `docs/AI_CONTEXT.md` (Project overview, tech stack, business rules, current roadmap)
  - [x] `docs/PRD.md` (Product Requirements Document: Features, Personas, Flow)
  - [x] `docs/ARCHITECTURE.md` (System layers, Service-Repository pattern, Data flow)
- [x] **2.2 Technical & Domain Documentation**
  - [x] `docs/DATABASE.md` (ERD, Table schemas, Indexes, Constraints)
  - [x] `docs/API.md` (REST/Route handler specifications, Request/Response payloads)
  - [x] `docs/AUTH.md` (Authentication flow, Session management, RBAC)
  - [x] `docs/ANALYSIS_ENGINE.md` (Character scoring math, Normalization formula 1-100, Versioning)
  - [x] `docs/STRIPE.md` (Webhook flow, Idempotency, Checkout sessions, Product catalog mapping)
  - [x] `docs/SECURITY.md` (Threat model, OWASP controls, Rate limiting, Input sanitization)
  - [x] `docs/TESTING.md` (Testing strategy, Unit, Integration, E2E)
  - [x] `docs/DEPLOYMENT.md` (Docker deployment, CI/CD guidelines, Migration commands)
  - [x] `docs/ADMIN_GUIDE.md` (Admin features, config changes, audit logs)
  - [x] `docs/DECISIONS.md` (Architecture Decision Records — ADRs)
  - [x] `docs/CHANGELOG.md` & `docs/TODO.md`

---

## PHASE 3: Database Design, Prisma Schema & Seed Data
- [x] **3.1 Identity & Access Models**
  - [x] `users` (id, email, password_hash, role: USER/ADMIN, is_active, created_at, updated_at)
  - [x] `sessions` (id, user_id, session_token, expires_at, ip_address, user_agent)
- [x] **3.2 Analysis Engine & Configuration Models**
  - [x] `name_components` (id, key, label, description, is_required, is_enabled, weight, sort_order)
  - [x] `character_scores` (id, character, language: TH/EN, score, is_active, updated_at)
  - [x] `analysis_configs` (id, version, free_first_name_limit, free_surname_limit, free_combined_limit, score_precision, missing_field_policy, max_input_length, is_active)
  - [x] `score_interpretations` (id, score_min, score_max, category, title, description, recommendation, language, is_active)
  - [x] `analyses` (id, user_id, analysis_type: FIRST_NAME/SURNAME/COMBINED, input_text, normalized_text, raw_score, final_score, calculation_version, snapshot_config, created_at)
  - [x] `analysis_components` (id, analysis_id, component_key, score, weight_used)
  - [x] `analysis_character_details` (id, analysis_id, character, mapped_score)
- [x] **3.3 Entitlement, Credit Ledger & E-Commerce Models**
  - [x] `products` (id, code, name, description, product_type: ANALYSIS_PACKAGE/SERVICE/SUBSCRIPTION, price, currency, stripe_price_id, is_active, sort_order, metadata)
  - [x] `product_entitlements` (id, product_id, credit_type: FIRST_NAME/SURNAME/COMBINED, quantity)
  - [x] `credit_ledger` (id, user_id, credit_type, amount, source_type: FREE/PURCHASE/ADMIN_ADJUSTMENT/REFUND/EXPIRED, source_id, created_at)
  - [x] `orders` / `payments` (id, user_id, product_id, stripe_customer_id, stripe_checkout_session_id, stripe_payment_intent_id, stripe_subscription_id, amount, currency, status, created_at, paid_at)
  - [x] `service_orders` (id, user_id, product_id, order_id, status: PENDING_PAYMENT/PAID/FORM_SUBMITTED/IN_REVIEW/IN_PROGRESS/COMPLETED/CANCELLED, form_data, result_data, notes, assigned_admin_id)
- [x] **3.4 Audit & Security Models**
  - [x] `stripe_webhook_events` (id, stripe_event_id, event_type, processed, processed_at, created_at)
  - [x] `admin_audit_logs` (id, admin_user_id, action, target_type, target_id, metadata, ip_address, created_at)
  - [x] `rate_limit_entries` (id, key, points, expire_at)
- [x] **3.5 Seed Data Implementation (`prisma/seed.ts`)**
  - [x] Default Name Components (First Name 60% enabled, Last Name 40% enabled, Middle Name disabled, Nickname disabled)
  - [x] Default Analysis Config (Free Limits: 2 First Name, 2 Surname, 0 Combined; Policy: REDISTRIBUTE_WEIGHT)
  - [x] Character Score Tables (Unicode Thai ก-ฮ, English A-Z & vowels/tones)
  - [x] Default Score Interpretations (Ranges: 1-20, 21-40, 41-60, 61-80, 81-100)
  - [x] Initial Products (Free, 1 Set: $19, 2 Sets: $24, 3 Sets: $45, 5 Sets: $65, Baby Naming: $150, Name Change: $190, Surname Creation: $360)
  - [x] Admin user generation script (`npm run db:create-admin`)

---

## PHASE 4: Authentication & Authorization System
- [x] **4.1 Security & Auth Services**
  - [x] Password Hashing with Argon2id (salt generation, time/memory cost configuration)
  - [x] Session Management: Secure HttpOnly, SameSite, Secure Cookie handling
  - [x] Server-side Protected Route Middleware (`/dashboard`, `/analyze`, `/account`, `/admin/*`)
  - [x] Server-side Role Authorization (`requireAuth()`, `requireAdmin()`)
- [x] **4.2 Auth Endpoints & Server Actions**
  - [x] Signup (`POST /api/auth/signup`): Zod validation, email format, password strength, duplicate check, transaction-safe free credit allotment
  - [x] Signin (`POST /api/auth/signin`): Rate limiting, brute-force mitigation, timing-safe compare
  - [x] Signout (`POST /api/auth/signout`): Session invalidation and cookie clearing
  - [x] Password Reset Flow (`/forgot-password`, `/reset-password` with secure signed token)
- [x] **4.3 Auth UI Components**
  - [x] Signin Page (`/signin`) & Signup Page (`/signup`)
  - [x] Responsive, accessible forms, clear error states, loading spinners (no emoji)

---

## PHASE 5: Core Namenology Analysis Engine
- [x] **5.1 Text Processing & Normalization**
  - [x] Unicode normalization (NFC/NFKC) for Thai & English characters
  - [x] Whitespace trimming and unsupported character handling
- [x] **5.2 Scoring Algorithm (`services/analysis/scoring.service.ts`)**
  - [x] Character score lookup from DB/Cache (Unicode Thai + English)
  - [x] Dynamic Name Component calculation
  - [x] Dynamic Weight distribution (Validating total = 100%)
  - [x] Missing Field Handling (Policy: `REDISTRIBUTE_WEIGHT` vs no-redistribute)
  - [x] Final Score Normalization to 1-100 scale (with configurable precision)
  - [x] Interpretation Resolver: Map score to DB interpretation category and description
- [x] **5.3 Specific Analysis Types (REQ-B18, B19, B20)**
  - [x] First Name Analysis
  - [x] Surname Analysis
  - [x] Combined Name + Surname Analysis (Distinct calculation & entitlement check)
- [x] **5.4 Calculation Versioning & Snapshotting (REQ-B24)**
  - [x] Store `calculation_version` and config snapshot in `analyses` table
  - [x] Guarantee historical reproducibility when admin alters weights/scores

---

## PHASE 6: Entitlement, Credit Ledger & Transaction Safety
- [x] **6.1 Entitlement Engine (`services/entitlement.service.ts`)**
  - [x] Separate quota buckets: `FIRST_NAME`, `SURNAME`, `COMBINED`
  - [x] Free Quota check (2 First Name, 2 Surname, 0 Combined by default)
  - [x] Server-side `canAnalyzeUser(userId, analysisType)` verification
- [x] **6.2 Atomic Credit Reservation & Consumption (REQ-B04, B14)**
  - [x] Database Transaction / Row-level locking to prevent race conditions and multi-tab exploits
  - [x] Deduct credit only on successful calculation
  - [x] Rollback on calculation or DB failure; Validation error must NOT consume quota
  - [x] Audit trail recording in `credit_ledger` table

---

## PHASE 7: Stripe Payment, Subscriptions & Products
- [x] **7.1 Stripe Integration Infrastructure**
  - [x] Stripe Client initialization with secret key
  - [x] Server-side checkout session creation (`POST /api/stripe/checkout`)
  - [x] Stripe Customer creation & mapping to `User`
  - [x] Stripe Customer Portal session generation
- [x] **7.2 Product Catalog & Entitlement Synchronization**
  - [x] Dynamic product loading from DB (No hard-coded prices in UI)
  - [x] One-time package checkout handling ($19, $24, $45, $65)
  - [x] Recurring subscription handling (if enabled)
  - [x] Professional service purchase checkout handling ($150, $190, $360)
- [x] **7.3 Stripe Webhook Processing (High Security)**
  - [x] Raw request body extraction & Stripe signature verification (`POST /api/stripe/webhook`)
  - [x] Idempotency enforcement via `stripe_webhook_events` table
  - [x] Webhook handlers:
    - [x] `checkout.session.completed` -> Grant credits to ledger, create `orders` record
    - [x] `customer.subscription.created/updated/deleted` -> Sync subscription status
    - [x] `payment_intent.payment_failed` -> Log error and update order state
    - [x] `charge.refunded` -> Revoke unused credits according to refund policy (REQ-B34)
  - [x] **Never trust browser redirect for credit allocation!**

---

## PHASE 8: User Experience, Dashboard & Analysis UI
- [x] **8.1 Public Pages (ตามสไตล์ Modern Mystic SaaS)**
  - [x] Landing Page (`/`): Hero with Cosmic Glow / Mystic Geometry, Features, How It Works, Pricing Section, FAQ, CTA, Footer
  - [x] Pricing Page (`/pricing`): Dynamic product cards displaying complete sets & entitlements clearly
- [x] **8.2 User Dashboard (`/dashboard`)**
  - [x] Separate balance widgets: First Name Remaining, Surname Remaining, Combined Remaining
  - [x] Subscription & Order status cards
  - [x] Recent Analyses list with Quick Action buttons
  - [x] Paywall Card: Shown when free limits are exhausted or when attempting Combined Analysis on Free plan
- [x] **8.3 Analysis Workflow (`/analyze`)**
  - [x] Dynamic Form generated from Active Name Components
  - [x] Single Analysis & Bulk / Pairing Analysis UI (REQ-B41, B42)
  - [x] Analysis Result View (`/analyze/result/[id]`):
    - [x] Circular Progress / Donut score gauge (1-100) with subtle glow
    - [x] Score breakdown by Component & Weight
    - [x] Character-by-character score breakdown table
    - [x] Interpretation text loaded from database
  - [x] Analysis History Page (`/analysis-history`): Filter, search, masked names, pagination, export
- [x] **8.4 Professional Services User Workflow**
  - [x] Reusable Service Form (`/services/[code]`): Baby Naming, Name Change, Surname Creation
  - [x] Service Order status tracker (`/services/orders/[id]`)

---

## PHASE 9: Admin Dashboard & Configuration Center
- [x] **9.1 Admin Authentication & RBAC Guard**
  - [x] Strict Server-side route authorization for `/admin/*` and `/api/admin/*`
- [x] **9.2 Admin Overview (`/admin/dashboard`)**
  - [x] KPI Cards: Total Users, Active Subscriptions, Free Analyses Used, Paid Analyses, Total Revenue
  - [x] Recent activity & system health metrics
- [x] **9.3 Character Score Management (`/admin/characters`)**
  - [x] Data table with Search, Filter by Language (TH/EN) & Status, Pagination
  - [x] Create, Edit, Toggle Active, and Bulk Update character scores
- [x] **9.4 Name Component Management (`/admin/components`)**
  - [x] Add/Edit Component (Label, Key, Required, Enabled, Sort Order)
  - [x] Weight configuration with Server-side validation (Total must equal 100%)
- [x] **9.5 System & Analysis Settings (`/admin/settings`)**
  - [x] Free Limits (First Name, Surname, Combined)
  - [x] Score Decimal Precision & Missing Field Policy (`REDISTRIBUTE_WEIGHT`)
  - [x] Formula Version bump management
- [x] **9.6 Product Catalog Management (`/admin/products`)**
  - [x] Create/Edit Products, display prices, Stripe Price IDs, Entitlement counts, Active toggles
- [x] **9.7 Service Order Management (`/admin/service-orders`)**
  - [x] Table of incoming service requests (Baby Naming, Name Change, Surname Creation)
  - [x] Status updates (In Review, In Progress, Completed), specialist assignment, internal notes, result delivery
- [x] **9.8 User Management (`/admin/users`)**
  - [x] Search, filter, view usage, view subscription, grant/adjust credits, disable account
- [x] **9.9 Audit Logs (`/admin/audit-logs`)**
  - [x] Searchable log of administrative actions (who changed what, when, IP address)

---

## PHASE 10: Security Hardening & Rate Limiting (OWASP Compliance)
- [x] **10.1 Security Headers**
  - [x] Implement CSP (Content-Security-Policy), HSTS, X-Content-Type-Options, Referrer-Policy, Frame-Options in `next.config.mjs` & middleware
- [x] **10.2 Rate Limiting Layer**
  - [x] In-memory / Database Rate Limiter interface (`src/lib/security/rate-limiter.ts`) for Auth endpoints, Analysis requests, Stripe checkout, Admin APIs
- [x] **10.3 Input Sanitization & Injection Prevention**
  - [x] Strict Zod validation schemas on all inputs & `sanitizeString` / `sanitizeObject` stripping XSS vectors and normalizing Unicode (NFC)
  - [x] Parameterized Prisma queries (No raw SQL string concatenation)
- [x] **10.4 Sensitive Data Redaction & Logging**
  - [x] Structured Logger (`src/lib/logger.ts`) with INFO, WARN, ERROR, SECURITY levels
  - [x] Redact passwords, Stripe secrets, tokens, and raw personal identifiers from logs

---

## PHASE 11: Testing & Quality Assurance
- [x] **11.1 Unit Tests (Vitest)**
  - [x] Character scoring logic (Thai & English characters) & Unicode NFC normalization
  - [x] Weight calculation & redistribution on missing fields (`REDISTRIBUTE_WEIGHT` & `SKIP`)
  - [x] Normalization formula (1-100) & score precision
  - [x] Entitlement check & credit consumption rules
  - [x] Security cryptography (Argon2id), rate limiting, and sensitive data redaction
- [x] **11.2 Integration Tests**
  - [x] User signup & automatic free quota allocation (2 First Name, 2 Surname, 0 Combined)
  - [x] Concurrency test: Simultaneous requests preventing credit double-spend
  - [x] Stripe webhook signature verification & idempotent processing
  - [x] Admin weight configuration validation (Strict rejection when sum != 100%)
- [x] **11.3 E2E Tests (`scripts/test-e2e-flow.ts`)**
  - [x] Full user journey: Signup -> Free Analysis #1 -> Free Analysis #2 -> Analysis #3 blocked -> Paywall displayed
  - [x] Free tier combined analysis blockage (REQ-B40) & post-package purchase analysis execution
  - [x] Concurrency race-condition verification & CSV history export verification (REQ-B47)

---

## PHASE 12: Production Readiness, Docker Verification & AI Handoff
- [x] **12.1 Docker Verification**
  - [x] Hardened multi-stage Alpine Dockerfile with Alpine Prisma client generation & standalone Next.js tracing
  - [x] Configure postgres:16-alpine with healthchecks in docker-compose.yml
  - [x] Validate non-root execution in app container (nextjs:nodejs UID 1001)
- [x] **12.2 Security Audit & NPM Audit**
  - [x] Run `npm audit` and document dependency vulnerability report
  - [x] Complete `docs/SECURITY.md` audit checklist (100% verified)
- [x] **12.3 Final Documentation & Handoff Check**
  - [x] Update `docs/AI_CONTEXT.md` with complete implementation state across all 12 Phases
  - [x] Sync `docs/TODO.md` with all completed milestones (0 pending debt)
  - [x] Verify that no business logic, scores, or product prices are hardcoded in UI components (100% database-driven)
