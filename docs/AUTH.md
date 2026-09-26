# AUTHENTICATION — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. Overview

Custom authentication system built for full control over password hashing, session management, and role-based authorization. NOT using NextAuth/Auth.js — this is intentional for Argon2id support and granular session control (see `docs/DECISIONS.md`).

---

## 2. Password Security

### Hashing Algorithm: Argon2id

Configuration:
```
Algorithm: Argon2id (recommended by OWASP)
Time Cost: 3 iterations
Memory Cost: 65536 KiB (64 MB)
Parallelism: 4
Salt: 16 bytes (auto-generated per password)
Hash Length: 32 bytes
```

Rules:
- Passwords are NEVER stored in plaintext
- Passwords are NEVER logged
- Password comparison uses timing-safe methods to prevent timing attacks
- Minimum password length: 8 characters
- Password strength validation on signup (requires mix of character types)

### Password Reset Flow
```
User requests reset → Server generates signed token (expires in 1 hour)
→ Token stored hashed in DB → Email sent with reset link
→ User submits new password + token → Server validates token signature + expiry
→ Password updated → All existing sessions invalidated → New session created
```

---

## 3. Session Management

### Session Storage: Server-Side (Database)

Each session creates a record in the `sessions` table with:
- Random `session_token` (cryptographically secure, 64 chars)
- `expires_at` timestamp (default: 30 days from creation)
- `user_id` reference
- Optional `ip_address` and `user_agent` for audit

### Cookie Configuration

```
Name: namenology_session
Value: session_token (opaque, random)
HttpOnly: true (prevents XSS access)
Secure: true in production (HTTPS only)
SameSite: Lax (CSRF protection, allows top-level navigations)
Path: /
Max-Age: 30 days (matches session expiry)
```

### Session Lifecycle
1. **Creation:** On successful signup or signin
2. **Validation:** On every protected request (check token exists in DB, not expired)
3. **Refresh:** Optionally extend expiry on active use
4. **Destruction:** On signout (delete DB record + clear cookie)
5. **Expiration:** Cron or lazy cleanup of expired sessions

---

## 4. Role-Based Access Control (RBAC)

### Roles

| Role | Access |
|---|---|
| `USER` | Dashboard, analysis, subscription, account, analysis history |
| `ADMIN` | Everything USER can access + admin dashboard, configuration, user management |

### Implementation

```typescript
// Server-side middleware functions
async function requireAuth(): Promise<UserSession>
  // Reads session cookie → validates in DB → returns user session
  // Throws/redirects if invalid

async function requireAdmin(): Promise<UserSession>
  // Calls requireAuth() → checks role === 'ADMIN'
  // Throws 403 if not admin
```

### Route Protection Matrix

| Route Pattern | Auth Required | Role Required |
|---|---|---|
| `/`, `/pricing` | No | — |
| `/signin`, `/signup` | No (redirect if logged in) | — |
| `/dashboard`, `/analyze`, `/account` | Yes | USER |
| `/analysis-history`, `/subscription` | Yes | USER |
| `/admin/*` | Yes | ADMIN |
| `/api/auth/signup`, `/api/auth/signin` | No | — |
| `/api/me/*` | Yes | USER |
| `/api/analysis/*` | Yes | USER |
| `/api/stripe/checkout`, `/api/stripe/portal` | Yes | USER |
| `/api/stripe/webhook` | No (Stripe signature) | — |
| `/api/admin/*` | Yes | ADMIN |
| `/api/health` | No | — |

---

## 5. Security Measures

### Brute Force Protection
- Rate limiting on `/api/auth/signin`: max 5 attempts per 15 minutes per IP
- Rate limiting on `/api/auth/signup`: max 3 attempts per 15 minutes per IP
- Rate limiting on password reset: max 3 attempts per hour per email

### Account Enumeration Prevention
- Signin error message is always generic: "Invalid email or password"
- Signup checks email uniqueness but returns generic error timing
- Password reset always responds with "If an account exists, a reset email has been sent"

### Session Security
- Session tokens are cryptographically random (not predictable)
- Session validated server-side on every request (not just cookie presence)
- Logout invalidates session in database (not just cookie deletion)
- Password change invalidates all other sessions

### CSRF Protection
- SameSite=Lax cookie prevents most CSRF vectors
- State parameters in Stripe checkout flows
- All mutating operations use POST/PATCH/DELETE (not GET)
