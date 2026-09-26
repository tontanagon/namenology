# PRODUCT REQUIREMENTS DOCUMENT (PRD) — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. Product Summary

Namenology is a production-ready SaaS web application that provides algorithmic name analysis based on character-level numeric scoring. The platform serves individual users seeking auspicious name evaluations and offers professional naming consultation services.

---

## 2. Target Users / Personas

### 2.1 Free User (Guest → Registered)
- Registers for a free account
- Receives 2 free First Name analyses and 2 free Surname analyses
- Cannot access Combined (First Name + Surname) analysis on free plan
- Sees paywall after exhausting free credits
- Can purchase one-time analysis packages

### 2.2 Paid User (Package Purchaser)
- Purchases analysis packages ($19, $24, $45, $65)
- Receives explicit credit entitlements per type (First Name, Surname, Combined)
- Can perform unlimited analyses up to purchased credit balance
- Can view full analysis history with reproducible snapshots

### 2.3 Professional Service Client
- Purchases specialist services (Baby Naming $150, Name Change $190, Surname Creation $360)
- Submits detailed service request forms
- Receives results through a managed Service Order workflow

### 2.4 Admin
- Manages character score mappings (Thai + English)
- Configures name component weights (must sum to 100%)
- Sets free analysis limits, score precision, missing field policies
- Manages product catalog, pricing, and Stripe Price IDs
- Reviews service orders, assigns specialists, delivers results
- Views user management, subscription status, and audit logs
- All admin actions are audited

---

## 3. Core Features

### 3.1 Name Analysis Engine
- Character-by-character numeric scoring from database-driven mappings
- Support for Thai (ก-ฮ, vowels, tonal marks) and English (A-Z) characters
- Dynamic weight system across configurable name components
- Missing optional field redistribution policy
- Score normalization to 1-100 scale
- Database-driven interpretation (score range → title, description, recommendation)
- Formula versioning with immutable snapshots

### 3.2 Analysis Types
- **First Name Analysis** — Individual given name evaluation
- **Surname Analysis** — Individual family name evaluation
- **Combined Analysis** — First Name + Surname harmonization (separate product/credit)

### 3.3 Entitlement & Credit System
- Independent credit buckets: FIRST_NAME, SURNAME, COMBINED
- Free tier: 2 First Name + 2 Surname + 0 Combined (configurable)
- Paid packages grant explicit per-type credits
- Auditable credit ledger with source tracking (FREE, PURCHASE, ADMIN_ADJUSTMENT, REFUND)
- Atomic credit reservation with race condition prevention

### 3.4 Product Catalog
| Product | Price | First Name | Surname | Combined |
|---|---|---|---|---|
| Free Trial | $0 | 2 | 2 | 0 |
| 1 Complete Set | $19 | 1 | 1 | 1 |
| 2 Complete Sets | $24 | 2 | 2 | 2 |
| 3 Complete Sets | $45 | 3 | 3 | 3 |
| 5 Complete Sets | $65 | 5 | 5 | 5 |
| Baby Naming | $150 | Service Order | — | — |
| Name Change | $190 | Service Order | — | — |
| Surname Creation | $360 | Service Order | — | — |

### 3.5 Professional Services
- Baby Naming, Name Change, Surname Creation
- Service Order workflow: PENDING_PAYMENT → PAID → FORM_SUBMITTED → IN_REVIEW → IN_PROGRESS → COMPLETED
- Admin assignment and internal notes (not visible to customer)
- Configurable service-specific form fields

### 3.6 Stripe Payment Integration
- Stripe Checkout for one-time package purchases and service orders
- Stripe Subscription support for future recurring plans
- Stripe Customer Portal for self-service subscription management
- Webhook-driven credit granting (never trust browser redirect)
- Signature verification + idempotent event processing

### 3.7 Admin Dashboard
- System overview KPIs (users, revenue, analyses, subscriptions)
- Character score CRUD with search, filter (language, status), pagination
- Name component management (label, key, weight, required/optional, enabled/disabled)
- System settings (free limits, score precision, missing field policy)
- Product catalog management
- Service order management with specialist assignment
- User management (search, filter, view usage, disable accounts)
- Audit log viewer

---

## 4. User Flows

### 4.1 Guest → Free User
```
Landing Page → Sign Up → Dashboard → Analyze (2 free) → Paywall → Purchase Package
```

### 4.2 Paid User
```
Login → Dashboard → Analyze → View Results → Analysis History
```

### 4.3 Subscription / Purchase
```
Pricing → Choose Package → Stripe Checkout → Webhook → Credits Granted → Analyze
```

### 4.4 Professional Service
```
Service Page → Purchase → Submit Form → Admin Review → Result Delivery
```

### 4.5 Admin
```
Admin Login → Dashboard → Configure Scores/Weights/Products → Manage Users → View Audit Logs
```

---

## 5. Pages & Routes

### Public
- `/` — Landing page (Hero, Features, How It Works, Pricing, FAQ, CTA, Footer)
- `/pricing` — Detailed package and service pricing

### Auth
- `/signin` — Email + password login
- `/signup` — Registration with automatic free credit allocation
- `/forgot-password` — Password reset request
- `/reset-password` — Token-based password reset

### User (Protected)
- `/dashboard` — Credit balances, subscription status, recent analyses
- `/analyze` — Dynamic analysis form (component fields from DB config)
- `/analyze/result/[id]` — Analysis result with score gauge, breakdown, interpretation
- `/analysis-history` — Paginated history with filtering
- `/subscription` — Current plan, manage subscription via Stripe Portal
- `/account` — Profile, usage stats, delete account

### Admin (Protected, Role = ADMIN)
- `/admin/dashboard` — KPI overview
- `/admin/characters` — Character score management
- `/admin/components` — Name component & weight configuration
- `/admin/products` — Product catalog management
- `/admin/settings` — System configuration
- `/admin/users` — User management
- `/admin/service-orders` — Professional service workflow
- `/admin/subscriptions` — Subscription monitoring
- `/admin/audit-logs` — Administrative audit trail

### API Routes
- `POST /api/auth/signup`, `POST /api/auth/signin`, `POST /api/auth/signout`
- `GET /api/me`, `GET /api/me/usage`, `GET /api/me/subscription`
- `POST /api/analysis`, `GET /api/analysis/history`, `GET /api/analysis/:id`
- `POST /api/stripe/checkout`, `POST /api/stripe/portal`, `POST /api/stripe/webhook`
- `GET/POST/PATCH/DELETE /api/admin/characters`
- `GET/POST/PATCH /api/admin/components`
- `GET/PATCH /api/admin/settings`
- `GET /api/admin/users`
- `GET /api/health`

---

## 6. Non-Functional Requirements

- **Security**: OWASP compliance, Argon2id hashing, RBAC, rate limiting, security headers
- **Performance**: Server Components, pagination, DB indexing, N+1 avoidance, config caching
- **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels, color contrast
- **SEO**: Meta tags, Open Graph, sitemap, canonical URLs (public pages only)
- **Privacy**: Minimal data retention, account deletion, no unnecessary external data sharing
- **Internationalization**: Unicode support (Thai + English), future multi-language support
- **AI Handoff**: Comprehensive docs enabling autonomous AI agents to continue development
