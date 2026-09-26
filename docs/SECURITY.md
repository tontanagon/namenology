# SECURITY — NAMENOLOGY

Last Updated: 2026-09-22

---

## 1. Threat Model

### Assets to Protect
- User credentials (email, password hash)
- Session tokens
- Personal name data submitted for analysis
- Stripe API keys and webhook secrets
- Payment and financial records
- Admin configuration data

### Threat Actors
- External attackers (brute force, injection, credential stuffing)
- Malicious users (quota bypass, privilege escalation, data scraping)
- Compromised dependencies (supply chain attacks)

---

## 2. Security Controls

### 2.1 Authentication Security

| Control | Implementation |
|---|---|
| Password hashing | Argon2id with salt (OWASP recommended) |
| Session management | Server-side DB sessions with HttpOnly Secure SameSite cookies |
| Brute force protection | Rate limiting: 5 signin attempts / 15 min per IP |
| Account enumeration | Generic error messages for signin and password reset |
| Session expiration | 30-day TTL, destroyed on signout |
| Logout invalidation | Session deleted from DB + cookie cleared |

### 2.2 Authorization

| Control | Implementation |
|---|---|
| Role-based access | Server-side `requireAuth()` and `requireAdmin()` on every protected endpoint |
| No client trust | Server re-validates role on every request, never relies on frontend state |
| Admin route protection | Both middleware and route handler level checks |

### 2.3 Input Security

| Control | Implementation |
|---|---|
| Schema validation | Zod schemas on all API inputs (server-side is source of truth) |
| Max input length | Configurable (default 100 chars for names) |
| Unicode normalization | NFC normalization before processing |
| Sanitization | Output encoding for XSS prevention |

### 2.4 Injection Protection

| Attack Vector | Mitigation |
|---|---|
| SQL Injection | Prisma ORM with parameterized queries. NO raw SQL string concatenation. |
| XSS | React's automatic escaping + Content-Security-Policy header |
| Command Injection | No shell execution of user input |
| Header Injection | Framework-level header handling |

### 2.5 CSRF Protection

- SameSite=Lax cookie setting
- All mutating operations use POST/PATCH/DELETE
- State parameters in OAuth/Stripe redirect flows

### 2.6 Stripe Security

| Control | Implementation |
|---|---|
| Webhook verification | Stripe signature verified using raw body |
| Idempotent processing | stripe_webhook_events table prevents duplicate processing |
| Server-side entitlement | Credits granted only after webhook confirmation |
| No client trust | Browser redirect does NOT equal payment success |
| Secret protection | STRIPE_SECRET_KEY never exposed to client |

---

## 3. Security Headers

Configured in `next.config.mjs`:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains (production only)
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' js.stripe.com; frame-src js.stripe.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com;
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Note: CSP must allow Stripe JS and Google Fonts.

---

## 4. Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| POST /api/auth/signin | 5 requests | 15 minutes |
| POST /api/auth/signup | 3 requests | 15 minutes |
| POST /api/auth/forgot-password | 3 requests | 60 minutes |
| POST /api/analysis | 20 requests | 15 minutes |
| POST /api/stripe/checkout | 5 requests | 15 minutes |
| /api/admin/* | 100 requests | 15 minutes |

Rate limiter uses database-backed storage (PostgreSQL) with an interface allowing future migration to Redis.

---

## 5. Sensitive Data Handling

### Logging Rules
- NEVER log: passwords, session tokens, Stripe secret keys, raw personal names (beyond what's needed for debugging), full payment information
- DO log: user IDs, action types, timestamps, IP addresses (for security events), error codes

### Data Storage Rules
- Passwords stored as Argon2id hashes only
- Analysis input may be stored with privacy masking options
- Stripe keys stored only in environment variables, never in DB
- Admin audit logs never contain sensitive field values

### Data Retention
- Analysis history: retained until user requests deletion
- Sessions: cleaned up after expiry
- Audit logs: retained for compliance period
- Stripe webhook events: retained for reconciliation

---

## 6. Security Audit Checklist

```
[x] Authentication
  [x] Argon2id password hashing implemented
  [x] Timing-safe password comparison
  [x] Session tokens are cryptographically random
  [x] Sessions validated server-side on every request
  [x] Signout invalidates session in DB

[x] Authorization
  [x] requireAuth() on all protected routes
  [x] requireAdmin() on all admin routes
  [x] Role check is server-side, not client-side only

[x] Input Validation
  [x] Zod schemas on all API inputs
  [x] Server-side validation is source of truth
  [x] Max length enforcement
  [x] Unicode normalization

[x] Injection Prevention
  [x] No raw SQL string concatenation
  [x] Prisma parameterized queries used everywhere
  [x] No shell execution of user input
  [x] React output escaping for XSS

[x] Rate Limiting
  [x] Auth endpoints rate limited
  [x] Analysis endpoints rate limited
  [x] Admin endpoints rate limited

[x] Stripe Security
  [x] Webhook signature verification
  [x] Idempotent event processing
  [x] Credits granted from webhook only
  [x] Secret key not exposed to client

[x] Security Headers
  [x] CSP configured
  [x] X-Frame-Options set
  [x] HSTS enabled in production
  [x] Referrer-Policy set

[x] Secrets Management
  [x] No secrets in source code
  [x] .env.example has no real values
  [x] .gitignore excludes .env files

[x] Dependency Security
  [x] npm audit run and reviewed
  [x] No known critical vulnerabilities in active runtime dependencies
  [x] Dependencies kept up to date

[x] Docker Security
  [x] Non-root user in production container (nextjs:nodejs UID 1001)
  [x] No secrets in Dockerfile or docker-compose
  [x] Minimal base image (Alpine)

[x] Logging
  [x] No sensitive data in logs (Recursive redaction)
  [x] Structured logging with severity levels (INFO, WARN, ERROR, SECURITY)
  [x] Security events logged for monitoring
```

---

## 7. Known Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Rate limiter bypass via distributed IPs | Medium | Consider Cloudflare or WAF in production |
| Session token brute force | Low | 64-char random tokens make brute force infeasible |
| Prisma query complexity attacks | Low | Input validation limits scope of queries |
| Stripe webhook replay | Low | Idempotency table prevents duplicate processing |
| Admin account compromise | High | Strong password requirements, audit logging, limit admin count |

---

## 8. Future Security Improvements

- [ ] Two-factor authentication (TOTP) for admin accounts
- [ ] IP allowlisting for admin dashboard
- [ ] Redis-backed rate limiting for distributed deployments
- [ ] Content Security Policy reporting endpoint
- [ ] Automated dependency vulnerability scanning in CI
- [ ] OWASP ZAP automated scanning in staging environment
- [ ] Database encryption at rest
- [ ] Secrets management via HashiCorp Vault or cloud KMS
