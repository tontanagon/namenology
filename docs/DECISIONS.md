# ARCHITECTURE DECISIONS — NAMENOLOGY

Last Updated: 2026-09-22

---

This document records significant architecture and design decisions using the ADR (Architecture Decision Record) format. AI agents MUST read this before proposing changes that could reverse existing decisions.

---

## ADR-001: Custom Authentication over NextAuth/Auth.js

**Date:** 2026-09-22
**Status:** Accepted

**Context:**
NextAuth provides a convenient authentication wrapper but has limitations around password hashing algorithm choice and granular session control.

**Options:**
1. NextAuth with Credentials provider
2. Custom auth with Argon2id + server-side sessions

**Chosen:** Option 2 — Custom authentication

**Reason:**
- Full control over Argon2id hashing with configurable time/memory cost
- Server-side database sessions (not JWT) for immediate invalidation on logout
- No dependency on NextAuth's evolving API surface
- Simpler audit trail for session activity

**Trade-offs:**
- More code to maintain
- Must implement session management, CSRF protection, and cookie handling manually

---

## ADR-002: Service-Repository Pattern

**Date:** 2026-09-22
**Status:** Accepted

**Context:**
Need clear separation between business logic and database access to support testability and future changes.

**Options:**
1. Direct Prisma calls from API routes
2. Service layer only
3. Service-Repository pattern

**Chosen:** Option 3 — Service-Repository pattern

**Reason:**
- Services contain business logic, repositories contain data access
- Repository layer can be mocked for unit testing services
- Easier to optimize queries without changing business logic
- Follows PROJECT_SPEC.md section 34 guidance

**Trade-offs:**
- More files and abstraction layers
- Potential over-engineering for simple CRUD operations

---

## ADR-003: Credit Ledger over Simple Counter Fields

**Date:** 2026-09-22
**Status:** Accepted

**Context:**
Need to track user credit balances for analysis entitlements (REQ-B12). Options ranged from a simple integer field to a full transaction ledger.

**Options:**
1. Single `remaining_credits` integer field on user table
2. Separate counter fields per credit type on user table
3. Full credit ledger table with transaction history

**Chosen:** Option 3 — Credit ledger

**Reason:**
- Complete audit trail of how credits were earned and consumed
- Supports multiple sources: FREE, PURCHASE, ADMIN_ADJUSTMENT, REFUND, EXPIRED
- Balance calculation is always derivable from ledger (SUM of amounts)
- Prevents silent data corruption (counter gets out of sync)
- Required by REQ-B12 in Namenology_Business_Specification.md

**Trade-offs:**
- More complex balance queries (SUM aggregate vs simple read)
- Slightly more storage per transaction
- Must use transactions + row-level locking for atomic operations

---

## ADR-004: Configuration-Driven Architecture

**Date:** 2026-09-22
**Status:** Accepted

**Context:**
Business rules like character scores, weights, free limits, products, and interpretations must be changeable without code deployments (PROJECT_SPEC.md section 39).

**Chosen:** Store all configurable business rules in PostgreSQL tables, editable through Admin Dashboard.

**Reason:**
- Admin can modify behavior without developer intervention
- Supports A/B testing of different scoring models
- Natural versioning through analysis_configs table
- Required by PROJECT_SPEC.md sections 3, 5, 6, 39, and 60

---

## ADR-005: Separate Credit Types (Not Generic Counter)

**Date:** 2026-09-22
**Status:** Accepted

**Context:**
REQ-B03 explicitly states free quota is NOT a single generic "analysis count". The system must maintain separate entitlements for FIRST_NAME, SURNAME, and COMBINED.

**Chosen:** Three independent credit type buckets with separate tracking.

**Reason:**
- Free plan includes 2 First Name + 2 Surname but 0 Combined
- Paid packages grant specific per-type quantities
- Credits of one type cannot substitute for another
- Explicitly required by REQ-B03, B04, B11

---

## ADR-006: Formula Versioning with Config Snapshots

**Date:** 2026-09-22
**Status:** Accepted

**Context:**
When Admin changes character scores or weights, historical analyses must remain reproducible (PROJECT_SPEC.md section 40, REQ-B24).

**Chosen:** Store `calculation_version` string + `config_snapshot` JSONB in each analysis record.

**Reason:**
- Analysis #100 always shows the same result regardless of future config changes
- Snapshot contains the frozen state of weights and scoring parameters used
- Version string enables easy auditing of which formula produced which results

---

## ADR-007: Package 3 (5 Sets) Price — $65 Used as Seed Value

**Date:** 2026-09-22
**Status:** Accepted

**Context:**
REQ-B09 notes a discrepancy: one source section says $60, the summary table says $65.

**Chosen:** Use $65 (the latest summary-table value) as the initial seed price. Admin can change it.

**Reason:**
- REQ-B09 explicitly instructs to use the latest summary-table value
- Price is stored in product configuration, not hard-coded
- Admin can modify through dashboard at any time
- Stripe Price ID remains the source of truth for actual charges

---

## ADR-008: Tailwind CSS with Shadcn/UI Style Components

**Date:** 2026-09-22
**Status:** Accepted

**Context:**
THEME.md specifies using "Shadcn/ui or Tailwind UI" with beautiful design. PROJECT_SPEC.md specifies Tailwind CSS.

**Chosen:** Tailwind CSS with custom component library inspired by Shadcn/UI patterns (not a direct Shadcn installation).

**Reason:**
- Full control over component styling
- No dependency on Shadcn CLI or its update cycle
- Components use the same `cn()` utility pattern
- Matches the "Modern SaaS 2026 + Mystic/Cosmic" aesthetic in THEME.md
- Uses `lucide-react` for icons (no emoji)
