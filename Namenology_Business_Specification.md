# NAMENOLOGY BUSINESS SPECIFICATION

## Business Rules Addendum

This document extends the requirements defined in PROJECT_SPEC.md.

These business rules are authoritative for the Namenology product model, usage limits, analysis packages, pricing, and analysis workflow.

---

# REQ-B01 — PRODUCT MODEL

Namenology is a web application for:

1. Name analysis
2. Surname analysis
3. Combined Name + Surname analysis
4. Baby Naming Service
5. Name Change Service
6. Surname Creation Service

The architecture must allow additional services and products to be added in the future without rewriting the core payment system.

Products and prices must be configuration-driven.

Do NOT hard-code product IDs, prices, package quantities, or service names directly inside UI components.

---

# REQ-B02 — FREE ANALYSIS

A new registered user receives a free analysis allowance.

The initial free allowance is:

```text
First Name Analysis = 2 names
Surname Analysis = 2 surnames
Combined Analysis = 0
```

This means the user can submit:

```text
Name 1
Name 2

Surname 1
Surname 2
```

and receive individual analysis results for all four items.

Example:

```text
First Name:
Michael
William

Surname:
Smith
Brown
```

Free results:

```text
Michael → analyzed
William → analyzed
Smith → analyzed
Brown → analyzed
```

The following are NOT included in the free plan:

```text
Michael + Smith
William + Brown
```

The free plan must never generate or reveal Combined Name + Surname results.

---

# REQ-B03 — FREE QUOTA MODEL

Free quota is NOT a single generic "analysis count".

The system must maintain separate entitlements:

```text
free_first_name_remaining
free_surname_remaining
free_combined_remaining
```

Default:

```text
free_first_name_limit = 2
free_surname_limit = 2
free_combined_limit = 0
```

Admin must be able to change these limits.

Example future configuration:

```text
First Name = 3
Surname = 3
Combined = 1
```

Therefore the database and entitlement engine must support independent quota buckets.

---

# REQ-B04 — FREE QUOTA CONSUMPTION

A successfully completed First Name analysis consumes:

```text
1 First Name Analysis Credit
```

A successfully completed Surname analysis consumes:

```text
1 Surname Analysis Credit
```

A validation error must NOT consume quota.

A server error must NOT consume quota.

A failed transaction must NOT consume quota.

Quota consumption must be transaction-safe.

The system must prevent users from bypassing limits through:

* Multiple browser tabs
* Concurrent requests
* Replay requests
* Direct API calls

---

# REQ-B05 — COMBINED ANALYSIS

Combined Analysis means:

```text
First Name + Surname
```

The system must calculate the combined result using the Namenology calculation engine.

Example:

```text
Michael + Smith
```

must be treated as a separate analysis product from:

```text
Michael
```

and:

```text
Smith
```

Combined Analysis must have its own entitlement / credit.

---

# REQ-B06 — 2 NAME + 2 SURNAME COMBINED PACKAGE

The system must support a package that includes:

```text
2 First Name Analyses
2 Surname Analyses
2 Combined Name + Surname Analyses
```

Initial product:

```text
Price = USD 24
```

This product represents two complete name sets:

```text
Set 1:
First Name + Surname + Combined Result

Set 2:
First Name + Surname + Combined Result
```

The system must represent the included quantities explicitly.

Do not implement this as a single generic "2 analyses" balance.

---

# REQ-B07 — PAID PACKAGE 1

Package 1:

```text
Price = USD 19
```

Includes:

```text
1 First Name Analysis
1 Surname Analysis
1 Combined Name + Surname Analysis
```

Total complete sets:

```text
1 set
```

Entitlements:

```text
first_name = 1
surname = 1
combined = 1
```

---

# REQ-B08 — PAID PACKAGE 2

Package 2:

```text
Price = USD 45
```

Includes:

```text
3 First Name Analyses
3 Surname Analyses
3 Combined Name + Surname Analyses
```

Total complete sets:

```text
3 sets
```

Entitlements:

```text
first_name = 3
surname = 3
combined = 3
```

The displayed "$15/analysis" must be treated as a marketing calculation only.

The backend must use the actual package entitlement quantities.

---

# REQ-B09 — PAID PACKAGE 3

Package 3 includes:

```text
5 First Name Analyses
5 Surname Analyses
5 Combined Name + Surname Analyses
```

Total complete sets:

```text
5 sets
```

Entitlements:

```text
first_name = 5
surname = 5
combined = 5
```

There is a source-data discrepancy regarding the initial price:

One section specifies:

```text
$60
```

while the summary table specifies:

```text
$65
```

Therefore:

1. Do NOT hard-code either value.
2. Store the price in Product/Plan Configuration.
3. Initial seed value should use the latest summary-table value:

```text
USD 65
```

4. Record the discrepancy in:

```text
docs/DECISIONS.md
```

5. The Admin must be able to change the display price and Stripe Price ID through configuration where appropriate.
6. The Stripe Price ID must remain the source of truth for the actual amount charged.

---

# REQ-B10 — COMPLETE ANALYSIS SET

A "Complete Analysis Set" consists of:

```text
1 First Name
+
1 Surname
+
1 Combined Result
```

This concept should be represented in the product/entitlement model.

Example:

Package 1 = 1 complete set

Package 2 = 3 complete sets

Package 3 = 5 complete sets

The backend must not rely only on UI wording such as "1 analysis".

---

# REQ-B11 — PRODUCT ENTITLEMENT MODEL

Create an entitlement system that supports different product types.

Possible conceptual model:

```text
Product
  ├── First Name Credits
  ├── Surname Credits
  ├── Combined Credits
  └── Service Request
```

For analysis packages, products may grant:

```text
first_name_credits
surname_credits
combined_credits
```

For professional services, products should create a Service Order instead of analysis credits.

---

# REQ-B12 — CREDIT LEDGER

Do not rely only on a single integer field such as:

```text
remaining_credits
```

The system should maintain an auditable transaction history.

Recommended concept:

```text
credit_ledger
```

Fields may include:

```text
id
user_id
credit_type
amount
source_type
source_id
expires_at
created_at
```

Possible credit types:

```text
FIRST_NAME
SURNAME
COMBINED
```

Possible source types:

```text
FREE
PURCHASE
ADMIN_ADJUSTMENT
REFUND
EXPIRED
```

This allows the system to explain where credits came from.

---

# REQ-B13 — PURCHASE CONSUMPTION

When a user purchases a package:

```text
Stripe Payment
      ↓
Verified Webhook
      ↓
Payment / Order Record
      ↓
Grant Entitlements
      ↓
Credit Ledger Entry
```

Credits must only be granted after server-side confirmation of the payment/subscription/purchase state according to the configured Stripe flow.

Do not grant analysis credits solely because the browser returned from Stripe Checkout.

---

# REQ-B14 — CREDIT RESERVATION / RACE CONDITIONS

For an analysis request:

```text
Request
 ↓
Authenticate
 ↓
Authorize
 ↓
Check available entitlement
 ↓
Atomically reserve/consume credit
 ↓
Run calculation
 ↓
Save analysis result
```

The implementation must prevent double-spending of credits when simultaneous requests are made.

Use database transaction / row-level locking / atomic update where appropriate.

If analysis processing fails, the reserved credit should be restored or the transaction should roll back according to the implementation design.

---

# REQ-B15 — ANALYSIS HISTORY

Every successful analysis must be stored.

History must distinguish:

```text
FIRST_NAME
SURNAME
COMBINED
```

Each analysis should include:

```text
user_id
analysis_type
input_reference
result_score
analysis_version
calculation_version
created_at
```

Do not store more personal information than necessary.

---

# REQ-B16 — ANALYSIS ENGINE

The core Namenology engine must support:

```text
A-Z
   ↓
Numeric Mapping
   ↓
Calculation Rules
   ↓
Total
   ↓
Normalize to 1-100
   ↓
Interpretation
```

The engine must be separated from UI.

Example architecture:

```text
AnalysisForm
      ↓
Analysis Service
      ↓
Calculation Engine
      ↓
Character Mapping
      ↓
Namenology Rules
      ↓
Score Normalizer
      ↓
Interpretation Resolver
      ↓
Database
```

---

# REQ-B17 — CHARACTER MAPPING

Each supported character must have a configurable numeric value.

Example:

```text
A = 1
B = 2
C = 3
...
```

The actual values must come from the database/configuration.

The system must support future changes to:

* character scores
* supported characters
* language
* calculation rules

without requiring hard-coded UI changes.

---

# REQ-B18 — NAME ANALYSIS

For a First Name:

```text
Input
 ↓
Normalize
 ↓
Character Mapping
 ↓
Numeric Sequence
 ↓
Namenology Calculation
 ↓
Final Score 1-100
 ↓
Interpretation
```

The result should include the breakdown needed for the UI.

Example conceptual output:

```text
Original Name
Normalized Name
Character Values
Raw Total
Calculated Score
Interpretation
Calculation Version
```

---

# REQ-B19 — SURNAME ANALYSIS

Surname analysis follows the same engine but must remain a distinct analysis type.

Example:

```text
Smith
 ↓
Character Mapping
 ↓
Calculation
 ↓
Score 1-100
 ↓
Surname Interpretation
```

The system must support separate interpretation rules if the business requires different wording for First Name and Surname.

---

# REQ-B20 — COMBINED ANALYSIS

Combined analysis must combine First Name and Surname according to the configured Namenology rule.

Example:

```text
Michael + Smith
       ↓
Combined Character/Input Rule
       ↓
Numeric Calculation
       ↓
Final Score 1-100
       ↓
Combined Interpretation
```

Do not assume that Combined Analysis is simply:

```text
FirstNameScore + SurnameScore
```

unless the business rule explicitly defines it that way.

The calculation algorithm must be configurable/versioned.

---

# REQ-B21 — SCORE RANGE

The final score must be normalized to:

```text
1 - 100
```

The normalization formula must be documented in:

```text
docs/ANALYSIS_ENGINE.md
```

The implementation must allow future changes to the formula.

---

# REQ-B22 — INTERPRETATION DATABASE

The result text must come from the database rather than being hard-coded in React components.

Example:

```text
Score Range
1-20
21-40
41-60
61-80
81-100
```

Each range may contain:

```text
title
description
recommendation
category
active
language
```

The Admin must be able to:

* Add interpretation
* Edit interpretation
* Delete interpretation
* Enable / disable interpretation
* Change score range
* Change displayed text
* Support multiple languages in the future

---

# REQ-B23 — ANALYSIS CONFIGURATION

Admin must be able to configure:

```text
Character Mapping
Calculation Rules
Score Normalization
Score Ranges
Interpretations
Name Components
Weights
Free Limits
Products
Prices
Service Availability
```

The core system must remain configuration-driven.

---

# REQ-B24 — CALCULATION VERSIONING

Whenever calculation rules change, historical analyses must remain reproducible.

Each analysis must store:

```text
calculation_version
```

Optionally:

```text
configuration_snapshot
```

or references to immutable versioned configuration.

Example:

```text
Analysis #123
Calculation Version: v1.4
```

If Admin later changes the formula to v1.5:

Analysis #123 must still display the v1.4 result.

---

# REQ-B25 — SERVICE: BABY NAMING

Product:

```text
Baby Naming
Price = USD 150
```

Purpose:

Customer submits information about one child.

The system creates a service request for:

```text
1 person
```

The request may include configurable fields such as:

```text
Child Name / Current Name
Gender where business-required
Birth Date where business-required
Parent Information
Naming Preferences
Language
Cultural Preferences
Other Required Information
```

Do not hard-code the form fields if the business expects Admin configurability.

Create a service order workflow.

Possible status:

```text
PENDING_PAYMENT
PAID
FORM_SUBMITTED
IN_REVIEW
IN_PROGRESS
COMPLETED
CANCELLED
REFUNDED
```

---

# REQ-B26 — SERVICE: NAME CHANGE

Product:

```text
Name Change Service
Price = USD 190
```

Customer submits required information.

The request is handled by:

```text
System / Specialist Workflow
```

The system must create a Service Order.

Possible result:

```text
Suggested Names
Analysis Results
Explanation
Status
```

The exact workflow should remain extensible.

---

# REQ-B27 — SERVICE: SURNAME CREATION

Product:

```text
Surname Creation
Price = USD 360
```

Customer submits required information.

The system creates a Service Order.

The workflow should support:

```text
Payment
 ↓
Form Submission
 ↓
Review
 ↓
Work In Progress
 ↓
Result Delivery
 ↓
Completed
```

---

# REQ-B28 — FUTURE SERVICES

The system must support adding future products/services such as:

```text
Premium Name Consultation
Corporate Naming
Brand Naming
Couple Naming
Business Naming
Custom Analysis
```

without rewriting the payment infrastructure.

Use a generic product/service model.

---

# REQ-B29 — PRODUCT CATALOG

Create a Product Catalog.

Each product should support fields similar to:

```text
id
code
name
description
product_type
price
currency
stripe_price_id
active
sort_order
metadata
created_at
updated_at
```

Possible product types:

```text
ANALYSIS_PACKAGE
SERVICE
SUBSCRIPTION
```

The exact model can be improved by the architect.

---

# REQ-B30 — INITIAL PRODUCT CATALOG

Seed:

### Free

```text
2 First Name Analyses
2 Surname Analyses
0 Combined Analyses
Price = 0
```

### Package: 2 Sets

```text
2 First Name
2 Surname
2 Combined
Price = $24
```

### Package: 1 Set

```text
1 First Name
1 Surname
1 Combined
Price = $19
```

### Package: 3 Sets

```text
3 First Name
3 Surname
3 Combined
Price = $45
```

### Package: 5 Sets

```text
5 First Name
5 Surname
5 Combined
Price = $65
```

### Baby Naming

```text
Price = $150
```

### Name Change

```text
Price = $190
```

### Surname Creation

```text
Price = $360
```

All prices must be stored as configuration/data, not hard-coded in UI logic.

---

# REQ-B31 — PRICING DISPLAY

Pricing page must show the included entitlements clearly.

For example:

```text
$19
1 Complete Set

Includes:
1 First Name
1 Surname
1 Combined Result
```

For $45:

```text
3 Complete Sets

Includes:
3 First Names
3 Surnames
3 Combined Results
```

For $65:

```text
5 Complete Sets

Includes:
5 First Names
5 Surnames
5 Combined Results
```

The phrase "$15/analysis" or "$12/analysis" should only be shown if it is mathematically consistent with the actual pricing model.

The backend must never use the marketing unit price to determine entitlement.

---

# REQ-B32 — SUBSCRIPTION VS CREDIT PURCHASE

The architecture must distinguish:

1. Subscription
2. One-time Analysis Package Purchase
3. Professional Service Purchase

Do not model every payment as a subscription.

The existing system may use Stripe for all three, but the internal business models must remain distinct.

Example:

```text
Subscription
→ recurring entitlement

Analysis Package
→ finite credit entitlement

Professional Service
→ service order
```

---

# REQ-B33 — PAYMENT RECORD

Every successful purchase should create a Payment / Order record.

Possible fields:

```text
id
user_id
product_id
stripe_customer_id
stripe_checkout_session_id
stripe_payment_intent_id
stripe_subscription_id
amount
currency
status
created_at
paid_at
```

Use appropriate constraints and indexes.

---

# REQ-B34 — REFUND HANDLING

The architecture must support refunds.

If an analysis package is refunded:

the system must define what happens to unused credits.

Recommended default:

```text
Unused credits → revoked
Already consumed credits → recorded in audit/history
```

This rule must be documented and configurable where appropriate.

Do not silently delete financial or credit history.

---

# REQ-B35 — ADMIN PRODUCT MANAGEMENT

Admin Dashboard must allow:

* Create Product
* Edit Product
* Activate / Deactivate Product
* Change Display Name
* Change Description
* Configure Included Credits
* Configure Service Type
* Configure Sort Order
* View Stripe Price ID
* View Product Status

Actual Stripe amount must be validated against the Stripe configuration rather than relying on client-submitted prices.

---

# REQ-B36 — ADMIN ANALYSIS RULE MANAGEMENT

Admin Dashboard must allow management of:

```text
Character Values
Calculation Rules
Score Ranges
Interpretations
Analysis Versions
```

Any change affecting calculation must create a new version.

Do not silently mutate an old version that is referenced by historical analyses.

---

# REQ-B37 — USER DASHBOARD USAGE

Dashboard must clearly show separate balances:

```text
First Name Credits
Remaining: X

Surname Credits
Remaining: X

Combined Credits
Remaining: X
```

Also show:

```text
Purchased Packages
Service Orders
Analysis History
Payment History
```

---

# REQ-B38 — ANALYSIS ACCESS RULE

Before allowing an analysis request:

```text
Authenticate User
        ↓
Determine Analysis Type
        ↓
Check Entitlement
        ↓
Consume Appropriate Credit
        ↓
Perform Analysis
        ↓
Store Result
```

Examples:

First Name request:

```text
check FIRST_NAME credit
```

Surname request:

```text
check SURNAME credit
```

Combined request:

```text
check COMBINED credit
```

Never consume a different credit type as a substitute unless explicitly configured.

---

# REQ-B39 — FREE USER PAYWALL

After the user consumes:

```text
2 First Name free credits
+
2 Surname free credits
```

the user can still purchase additional analysis packages.

The UI should NOT incorrectly display:

```text
You have used all analyses.
```

Instead show separate usage states.

Example:

```text
First Name
0 free analyses remaining

Surname
0 free analyses remaining

Combined
Not included in Free Plan
```

Then show available packages.

---

# REQ-B40 — FREE COMBINED ANALYSIS UX

Free users must not be presented with a working Combined Analysis result.

When they attempt:

```text
Michael + Smith
```

the UI should explain that Combined Analysis requires an eligible purchase.

The server must enforce this regardless of UI state.

---

# REQ-B41 — BULK ANALYSIS

The UI may allow customers to submit multiple names/surnames in one session.

Example:

```text
First Names:
Michael
William

Surnames:
Smith
Brown
```

The backend must process each requested analysis according to available credits.

A batch request must not allow quota bypass.

For paid complete sets, the system should support pairing:

```text
Michael + Smith
William + Brown
```

or another explicitly selected pairing method.

The pairing rule must be clearly defined in the UX.

Do not automatically assume Cartesian product:

```text
Michael + Smith
Michael + Brown
William + Smith
William + Brown
```

unless a future product explicitly requires it.

---

# REQ-B42 — BUSINESS RULE FOR 2 + 2 PACKAGE

For the $24 package, the default interpretation is:

```text
2 First Names
2 Surnames
2 Combined Results
```

The system should model these as two complete sets.

Default pairing:

```text
Name 1 + Surname 1
Name 2 + Surname 2
```

The frontend should make the pairing explicit to the customer before purchase or analysis.

---

# REQ-B43 — SERVICE FORM ARCHITECTURE

Professional services must use reusable and configurable form components.

Possible shared components:

```text
ServiceForm
ServiceField
TextField
TextareaField
DateField
SelectField
CheckboxField
FileUploadField
FormSection
```

Service-specific forms must compose these components.

Do not create a completely separate form architecture for each service.

---

# REQ-B44 — SERVICE ORDER SYSTEM

Create a generic Service Order model.

Example:

```text
service_orders
```

Fields may include:

```text
id
user_id
product_id
order_id
status
form_data
assigned_admin_id
notes
result_data
created_at
updated_at
completed_at
```

Sensitive service data must have appropriate access controls.

---

# REQ-B45 — ADMIN SERVICE MANAGEMENT

Admin Dashboard must support:

* View Service Orders
* Filter by Service Type
* Filter by Status
* Assign Specialist/Admin
* Update Status
* View Submitted Information
* Add Internal Notes
* Submit Result
* Mark Completed

Internal notes must not automatically become visible to customers.

---

# REQ-B46 — ANALYSIS RESULT API

A result should return structured data rather than only formatted HTML.

Example conceptual response:

```json
{
  "analysisType": "FIRST_NAME",
  "input": "Michael",
  "characterValues": [],
  "rawTotal": 0,
  "score": 76,
  "interpretation": {
    "title": "",
    "description": ""
  },
  "calculationVersion": "1.0"
}
```

The actual schema can differ, but result data must remain machine-readable.

This is important for future:

* Mobile App
* API Client
* AI Integration
* Export
* Reporting

---

# REQ-B47 — AI-FRIENDLY ARCHITECTURE

The project must be understandable by multiple AI coding agents.

The AI context documentation must include the Namenology business model.

At minimum:

```text
docs/AI_CONTEXT.md
docs/ANALYSIS_ENGINE.md
docs/PRODUCT_CATALOG.md
docs/CREDIT_SYSTEM.md
docs/SERVICE_ORDERS.md
docs/STRIPE.md
docs/SECURITY.md
```

---

# REQ-B48 — BUSINESS RULE TRACEABILITY

Every implementation of the business logic must reference the corresponding requirement.

Example:

```text
REQ-B02
REQ-B03
REQ-B04
REQ-B05
...
```

This makes it possible for another AI to audit the implementation.

---

# REQ-B49 — NO HARDCODED PRICING

Never implement:

```ts
if (package === "PRO") price = 19
```

inside UI/business logic.

Use database-driven Product Catalog.

The frontend receives product information from a trusted server-side source.

For payment creation:

```text
Frontend Product ID
        ↓
Server loads Product
        ↓
Server validates active status
        ↓
Server loads Stripe Price ID
        ↓
Server creates Checkout
```

The browser must never be trusted to specify the actual payment amount.

---

# REQ-B50 — NO HARDCODED QUOTA

Never implement:

```ts
remaining = 2
```

as the source of truth.

Use:

```text
Product Entitlements
+
Credit Ledger
+
Free Entitlement
```

The database/service layer determines available credits.

---

# REQ-B51 — PAYMENT SECURITY

For Stripe:

* Validate webhook signatures.
* Use idempotent event processing.
* Do not trust price or amount from the browser.
* Do not grant credits from frontend redirect.
* Store payment/order records.
* Preserve financial history.
* Handle duplicate webhook events safely.
* Handle failed payments.
* Handle refunds.
* Handle cancellation according to product type.

---

# REQ-B52 — ADMIN CONFIGURATION

Admin must be able to modify business configuration without changing frontend source code where appropriate.

Examples:

```text
Free First Name Limit
Free Surname Limit
Free Combined Limit

Products
Prices
Credit Quantities

Character Mapping
Calculation Rules
Interpretation Rules
Score Ranges

Service Products
Service Prices
Service Form Fields
```

Critical payment logic must remain server-controlled.

---

# REQ-B53 — TEST CASES

The test suite must include:

### Free

```text
New User
→ First Name #1 works
→ First Name #2 works
→ First Name #3 blocked

Surname #1 works
Surname #2 works
Surname #3 blocked

Combined blocked
```

### Package $19

```text
Purchase
→ +1 First Name
→ +1 Surname
→ +1 Combined
```

### Package $45

```text
Purchase
→ +3 First Name
→ +3 Surname
→ +3 Combined
```

### Package $65

```text
Purchase
→ +5 First Name
→ +5 Surname
→ +5 Combined
```

### $24 Package

```text
Purchase
→ +2 First Name
→ +2 Surname
→ +2 Combined
```

### Concurrency

Two simultaneous requests must not consume the same single credit twice.

### Refund

Unused credits must be handled according to the refund policy.

### Admin

Changes to character/calculation configuration must create a new calculation version where required.

---

# REQ-B54 — ACCEPTANCE CRITERIA

The core business system is complete only when all of the following work:

```text
Free First Name Analysis
Free Surname Analysis
Combined Analysis Restriction
Credit Tracking
Paid Packages
Product Catalog
Stripe Payment
Payment Verification
Credit Granting
Credit Consumption
Analysis History
Calculation Engine
Interpretation Engine
Admin Configuration
Professional Services
Service Orders
Audit Logs
Security Controls
Documentation
```

---

# REQ-B55 — IMPORTANT BUSINESS PRINCIPLE

The system is NOT simply a "name analysis counter".

The actual business model is:

```text
User
  ↓
Entitlements
  ↓
Credit Types
  ├── FIRST_NAME
  ├── SURNAME
  └── COMBINED
        ↓
Analysis Engine
        ↓
Score 1-100
        ↓
Interpretation
```

Professional services use:

```text
User
  ↓
Product Purchase
  ↓
Service Order
  ↓
Service Form
  ↓
Specialist/Admin Workflow
  ↓
Result
```

These two domains must remain conceptually separate.
