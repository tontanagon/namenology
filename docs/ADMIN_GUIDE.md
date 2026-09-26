# ADMIN GUIDE — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. Accessing Admin Dashboard

Navigate to `/admin/dashboard` after signing in with an Admin account.

**Important:** Admin access is enforced server-side. Only users with `role = ADMIN` can access admin routes. Frontend-only role checks are never trusted.

---

## 2. Character Score Management

**Path:** `/admin/characters`

Manage the numeric score assigned to each character (Thai and English).

### Actions Available
- **Add Character:** Specify character, language (TH/EN), and score
- **Edit Score:** Modify the numeric value for an existing character
- **Toggle Active:** Enable/disable characters without deleting
- **Search:** Find characters by value
- **Filter:** By language (TH/EN) and status (Active/Inactive)
- **Pagination:** Navigate through large character sets

### Impact
Changing a character score affects ALL future analyses. Historical analyses are NOT affected (they use versioned snapshots).

Changing character scores should trigger a calculation version increment.

---

## 3. Name Component & Weight Management

**Path:** `/admin/components`

Manage the name components (First Name, Surname, Middle Name, Nickname, etc.) and their relative weights.

### Default Components
| Component | Key | Weight | Enabled |
|---|---|---|---|
| First Name | FIRST_NAME | 60% | Yes |
| Surname | SURNAME | 40% | Yes |
| Middle Name | MIDDLE_NAME | 0% | No |
| Nickname | NICKNAME | 0% | No |

### Rules
- **Total weight of enabled components must equal 100%**
- The system will reject any save that violates this rule
- Disabled components are hidden from the analysis form
- New components can be added for future expansion (e.g., English Name, Chinese Name)

### Adding a Component
1. Click "Add Component"
2. Fill in: Key (unique identifier), Label (display name), Description
3. Set Required/Optional, Enabled/Disabled, Weight, Sort Order
4. Adjust other component weights to maintain 100% total
5. Save

---

## 4. System Settings

**Path:** `/admin/settings`

### Configurable Settings

| Setting | Default | Description |
|---|---|---|
| Free First Name Limit | 2 | Number of free FIRST_NAME analyses per new user |
| Free Surname Limit | 2 | Number of free SURNAME analyses per new user |
| Free Combined Limit | 0 | Number of free COMBINED analyses per new user |
| Score Decimal Places | 2 | Precision for score display |
| Missing Field Policy | REDISTRIBUTE_WEIGHT | How to handle empty optional fields |
| Min Input Length | 1 | Minimum characters per name input |
| Max Input Length | 100 | Maximum characters per name input |

### Changing Settings
Changes take effect immediately for new analyses. Existing analyses retain their original configuration via versioned snapshots.

---

## 5. Product Catalog Management

**Path:** `/admin/products`

Manage analysis packages and professional service products.

### Initial Products
| Product | Price | Type | Credits (FN/SN/CB) |
|---|---|---|---|
| Free Trial | $0 | — | 2/2/0 (auto-granted on signup) |
| 1 Complete Set | $19 | ANALYSIS_PACKAGE | 1/1/1 |
| 2 Complete Sets | $24 | ANALYSIS_PACKAGE | 2/2/2 |
| 3 Complete Sets | $45 | ANALYSIS_PACKAGE | 3/3/3 |
| 5 Complete Sets | $65 | ANALYSIS_PACKAGE | 5/5/5 |
| Baby Naming | $150 | SERVICE | Creates Service Order |
| Name Change | $190 | SERVICE | Creates Service Order |
| Surname Creation | $360 | SERVICE | Creates Service Order |

### Important Rules
- Display prices are for informational purposes. Actual charges are determined by Stripe Price ID
- The Stripe Price ID must be created in Stripe Dashboard first, then mapped in the product record
- Products can be activated/deactivated without deletion

---

## 6. Service Order Management

**Path:** `/admin/service-orders`

Professional service requests go through a managed workflow.

### Status Flow
```
PENDING_PAYMENT → PAID → FORM_SUBMITTED → IN_REVIEW → IN_PROGRESS → COMPLETED
                                                                    → CANCELLED
                                                                    → REFUNDED
```

### Admin Actions
- View submitted customer information (form_data)
- Assign a specialist/admin to handle the request
- Add internal notes (NOT visible to customer)
- Update status as work progresses
- Submit result data when complete
- Mark as completed

---

## 7. User Management

**Path:** `/admin/users`

### Features
- Search users by email or name
- Filter by role (USER/ADMIN) and status (Active/Inactive)
- View user's credit balances per type
- View user's analysis history
- View user's subscription/order status
- Disable user accounts (sets `is_active = false`)
- Adjust credits via admin adjustment (creates audit log entry)

### Role Changes
Only existing admins can change user roles. Role changes are logged in the audit trail.

---

## 8. Audit Logs

**Path:** `/admin/audit-logs`

Every significant admin action is recorded:

- Who performed the action (admin_user_id)
- What action was performed (e.g., "UPDATE_CHARACTER_SCORE")
- What was affected (target_type, target_id)
- Additional metadata (old value, new value)
- When it happened (created_at)
- IP address (where applicable)

### Viewing Logs
- Filter by admin user, action type, target type
- Date range filtering
- Paginated results sorted by most recent

### Security Note
Audit logs NEVER contain passwords, tokens, secret keys, or full payment card details.
