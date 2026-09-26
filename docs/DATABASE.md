# DATABASE DESIGN — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. Overview

PostgreSQL 16 with Prisma ORM. All tables use UUID primary keys, `created_at` / `updated_at` timestamps, and appropriate indexes. Soft delete is used where business requires audit trail preservation.

---

## 2. Entity Relationship Diagram

```
users ──┬──< sessions
        ├──< credit_ledger
        ├──< analyses ──┬──< analysis_components
        │               └──< analysis_character_details
        ├──< orders
        ├──< service_orders
        └──< subscriptions

products ──< product_entitlements
products ──< orders
products ──< service_orders

name_components (standalone config)
character_scores (standalone config)
analysis_configs (standalone config, versioned)
score_interpretations (standalone config)

stripe_webhook_events (standalone)
admin_audit_logs (standalone)
rate_limit_entries (standalone)
```

---

## 3. Table Schemas

### 3.1 users

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, default gen_random_uuid() |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | TEXT | NOT NULL |
| name | VARCHAR(255) | NOT NULL |
| role | ENUM('USER', 'ADMIN') | NOT NULL, default 'USER' |
| is_active | BOOLEAN | NOT NULL, default TRUE |
| stripe_customer_id | VARCHAR(255) | UNIQUE, nullable |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL, auto-update |

**Indexes:** email (unique), stripe_customer_id (unique), created_at

---

### 3.2 sessions

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id, NOT NULL |
| session_token | VARCHAR(255) | UNIQUE, NOT NULL |
| expires_at | TIMESTAMPTZ | NOT NULL |
| ip_address | VARCHAR(45) | nullable |
| user_agent | TEXT | nullable |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** session_token (unique), user_id, expires_at

---

### 3.3 name_components

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| key | VARCHAR(50) | UNIQUE, NOT NULL (e.g., 'FIRST_NAME', 'SURNAME') |
| label | VARCHAR(100) | NOT NULL |
| description | TEXT | nullable |
| is_required | BOOLEAN | NOT NULL, default FALSE |
| is_enabled | BOOLEAN | NOT NULL, default TRUE |
| weight | DECIMAL(5,2) | NOT NULL, default 0 |
| sort_order | INTEGER | NOT NULL, default 0 |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** key (unique), is_enabled, sort_order

**Validation Rule:** Sum of weight for all enabled components MUST equal 100.00

---

### 3.4 character_scores

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| character | VARCHAR(10) | NOT NULL |
| language | ENUM('TH', 'EN') | NOT NULL |
| score | INTEGER | NOT NULL |
| is_active | BOOLEAN | NOT NULL, default TRUE |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** (character, language) unique composite, language, is_active

---

### 3.5 analysis_configs

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| version | VARCHAR(20) | UNIQUE, NOT NULL (e.g., '1.0', '1.1') |
| free_first_name_limit | INTEGER | NOT NULL, default 2 |
| free_surname_limit | INTEGER | NOT NULL, default 2 |
| free_combined_limit | INTEGER | NOT NULL, default 0 |
| score_precision | INTEGER | NOT NULL, default 2 |
| missing_field_policy | ENUM('REDISTRIBUTE_WEIGHT', 'SKIP') | NOT NULL, default 'REDISTRIBUTE_WEIGHT' |
| min_input_length | INTEGER | NOT NULL, default 1 |
| max_input_length | INTEGER | NOT NULL, default 100 |
| is_active | BOOLEAN | NOT NULL, default TRUE |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** version (unique), is_active

**Rule:** Only one config should be `is_active = TRUE` at a time

---

### 3.6 score_interpretations

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| score_min | INTEGER | NOT NULL |
| score_max | INTEGER | NOT NULL |
| category | VARCHAR(50) | NOT NULL |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | NOT NULL |
| recommendation | TEXT | nullable |
| language | VARCHAR(5) | NOT NULL, default 'en' |
| is_active | BOOLEAN | NOT NULL, default TRUE |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** (score_min, score_max, language), is_active

---

### 3.7 analyses

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id, NOT NULL |
| analysis_type | ENUM('FIRST_NAME', 'SURNAME', 'COMBINED') | NOT NULL |
| input_text | VARCHAR(200) | NOT NULL (may be masked for privacy) |
| normalized_text | VARCHAR(200) | NOT NULL |
| raw_score | DECIMAL(10,4) | NOT NULL |
| final_score | DECIMAL(10,4) | NOT NULL |
| calculation_version | VARCHAR(20) | NOT NULL |
| config_snapshot | JSONB | nullable (frozen config at calculation time) |
| status | ENUM('COMPLETED', 'FAILED', 'PENDING') | NOT NULL, default 'COMPLETED' |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** user_id, analysis_type, calculation_version, created_at

---

### 3.8 analysis_components

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| analysis_id | UUID | FK → analyses.id, NOT NULL |
| component_key | VARCHAR(50) | NOT NULL |
| input_text | VARCHAR(200) | NOT NULL |
| score | DECIMAL(10,4) | NOT NULL |
| weight_used | DECIMAL(5,2) | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** analysis_id

---

### 3.9 analysis_character_details

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| analysis_id | UUID | FK → analyses.id, NOT NULL |
| component_key | VARCHAR(50) | NOT NULL |
| character | VARCHAR(10) | NOT NULL |
| position | INTEGER | NOT NULL |
| mapped_score | INTEGER | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** analysis_id

---

### 3.10 products

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| code | VARCHAR(50) | UNIQUE, NOT NULL |
| name | VARCHAR(200) | NOT NULL |
| description | TEXT | nullable |
| product_type | ENUM('ANALYSIS_PACKAGE', 'SERVICE', 'SUBSCRIPTION') | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL |
| currency | VARCHAR(3) | NOT NULL, default 'USD' |
| stripe_price_id | VARCHAR(255) | nullable |
| is_active | BOOLEAN | NOT NULL, default TRUE |
| sort_order | INTEGER | NOT NULL, default 0 |
| metadata | JSONB | nullable |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** code (unique), product_type, is_active, sort_order

---

### 3.11 product_entitlements

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| product_id | UUID | FK → products.id, NOT NULL |
| credit_type | ENUM('FIRST_NAME', 'SURNAME', 'COMBINED') | NOT NULL |
| quantity | INTEGER | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** product_id, (product_id, credit_type) unique composite

---

### 3.12 credit_ledger

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id, NOT NULL |
| credit_type | ENUM('FIRST_NAME', 'SURNAME', 'COMBINED') | NOT NULL |
| amount | INTEGER | NOT NULL (positive = grant, negative = consume) |
| source_type | ENUM('FREE', 'PURCHASE', 'ADMIN_ADJUSTMENT', 'REFUND', 'EXPIRED') | NOT NULL |
| source_id | VARCHAR(255) | nullable (order_id, admin_id, etc.) |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** user_id, (user_id, credit_type), created_at

**Balance Calculation:** `SUM(amount) WHERE user_id = ? AND credit_type = ?`

---

### 3.13 orders

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id, NOT NULL |
| product_id | UUID | FK → products.id, NOT NULL |
| stripe_customer_id | VARCHAR(255) | nullable |
| stripe_checkout_session_id | VARCHAR(255) | nullable |
| stripe_payment_intent_id | VARCHAR(255) | nullable |
| stripe_subscription_id | VARCHAR(255) | nullable |
| amount | DECIMAL(10,2) | NOT NULL |
| currency | VARCHAR(3) | NOT NULL |
| status | ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL |
| paid_at | TIMESTAMPTZ | nullable |

**Indexes:** user_id, stripe_checkout_session_id, stripe_payment_intent_id, created_at

---

### 3.14 service_orders

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id, NOT NULL |
| product_id | UUID | FK → products.id, NOT NULL |
| order_id | UUID | FK → orders.id, nullable |
| status | ENUM (see ServiceOrderStatus) | NOT NULL |
| form_data | JSONB | nullable |
| result_data | JSONB | nullable |
| notes | TEXT | nullable (internal admin notes) |
| assigned_admin_id | UUID | FK → users.id, nullable |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |
| completed_at | TIMESTAMPTZ | nullable |

**Indexes:** user_id, product_id, status, assigned_admin_id, created_at

---

### 3.15 stripe_webhook_events

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| stripe_event_id | VARCHAR(255) | UNIQUE, NOT NULL |
| event_type | VARCHAR(100) | NOT NULL |
| processed | BOOLEAN | NOT NULL, default FALSE |
| processed_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** stripe_event_id (unique), event_type, processed

---

### 3.16 admin_audit_logs

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| admin_user_id | UUID | FK → users.id, NOT NULL |
| action | VARCHAR(100) | NOT NULL |
| target_type | VARCHAR(50) | NOT NULL |
| target_id | VARCHAR(255) | nullable |
| metadata | JSONB | nullable |
| ip_address | VARCHAR(45) | nullable |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** admin_user_id, action, target_type, created_at

**Rule:** NEVER log passwords, tokens, secrets, or Stripe keys in metadata.

---

### 3.17 rate_limit_entries

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| key | VARCHAR(255) | NOT NULL |
| points | INTEGER | NOT NULL, default 0 |
| expire_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** key, expire_at

---

## 4. Key Constraints & Rules

1. **Weight Validation:** The sum of `weight` for all `is_enabled = TRUE` rows in `name_components` must equal 100.00. Reject save otherwise.
2. **Credit Balance:** User balance per type = `SUM(amount) FROM credit_ledger WHERE user_id = ? AND credit_type = ?`. Never store balance as a cached counter.
3. **Idempotency:** `stripe_webhook_events.stripe_event_id` is unique. If event already processed, skip.
4. **Transaction Safety:** Credit reservation + analysis creation + ledger entry happen in a single database transaction with row-level locking.
5. **Soft Delete:** Consider for `users` (account deactivation) and `analyses` (privacy deletion requests). Use `is_active` flag rather than physical deletion where audit trails are needed.
