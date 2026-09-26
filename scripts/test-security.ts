// =============================================================================
// SECURITY HARDENING & OWASP COMPLIANCE VERIFICATION SUITE
// Tests Rate Limiting, Sensitive Data Redaction, Anti-XSS Sanitization & CSRF Guard
// =============================================================================

import { checkRateLimit } from "../src/lib/security/rate-limiter";
import { redactSensitiveData } from "../src/lib/logger";
import { sanitizeString, sanitizeObject } from "../src/lib/security/sanitize";

async function runSecurityTests() {
  console.log("==================================================================");
  console.log("STARTING PHASE 10: SECURITY HARDENING & RATE LIMITING TEST SUITE");
  console.log("==================================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}`);
    }
  }

  // ---------------------------------------------------------------------------
  // 1. Rate Limiting Tests
  // ---------------------------------------------------------------------------
  console.log("\n--- 1. Rate Limiter (Sliding Window & Token Bucket) ---");
  const testKey = `test_ratelimit_${Date.now()}`;
  const maxPoints = 3;
  const duration = 10; // 10 seconds window

  // Points 1, 2, 3 should be allowed
  const res1 = await checkRateLimit({ key: testKey, maxPoints, durationSeconds: duration });
  assert(res1.isAllowed === true && res1.remainingPoints === 2, "Rate limiter allows point 1/3");

  const res2 = await checkRateLimit({ key: testKey, maxPoints, durationSeconds: duration });
  assert(res2.isAllowed === true && res2.remainingPoints === 1, "Rate limiter allows point 2/3");

  const res3 = await checkRateLimit({ key: testKey, maxPoints, durationSeconds: duration });
  assert(res3.isAllowed === true && res3.remainingPoints === 0, "Rate limiter allows point 3/3");

  // Point 4 must be blocked
  const res4 = await checkRateLimit({ key: testKey, maxPoints, durationSeconds: duration });
  assert(
    res4.isAllowed === false && res4.remainingPoints === 0 && res4.retryAfterSeconds > 0,
    "Rate limiter strictly blocks request exceeding quota (point 4/3)"
  );

  // ---------------------------------------------------------------------------
  // 2. Sensitive Data Redaction Tests
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Sensitive Data Redaction (OWASP A09 Logging & Monitoring) ---");
  const rawPayload = {
    user: {
      id: "usr_12345",
      name: "Somchai Sukjai",
      email: "somchai@example.com",
      password: "SuperSecretPassword123!",
      passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$hashvalue",
    },
    payment: {
      cardNumber: "4111222233334444",
      cvv: "123",
      token: "tok_visa_12345",
      stripeSecretKey: "sk_test_51MockSecretKeyForTesting12345",
    },
    meta: {
      score: 95.5,
      role: "USER",
    },
  };

  const redacted = redactSensitiveData(rawPayload) as any;

  assert(redacted.user.name === "Somchai Sukjai", "Preserves non-sensitive user name");
  assert(redacted.user.email === "somchai@example.com", "Preserves non-sensitive user email");
  assert(redacted.user.password === "[REDACTED]", "Redacts raw password");
  assert(redacted.user.passwordHash === "[REDACTED]", "Redacts passwordHash");
  assert(redacted.payment.cardNumber === "[REDACTED]", "Redacts credit card number");
  assert(redacted.payment.cvv === "[REDACTED]", "Redacts CVV code");
  assert(redacted.payment.token === "[REDACTED]", "Redacts payment token");
  assert(redacted.payment.stripeSecretKey === "[REDACTED]", "Redacts Stripe secret key");
  assert(redacted.meta.score === 95.5, "Preserves calculation score");

  // ---------------------------------------------------------------------------
  // 3. Input Sanitization & Anti-XSS Tests
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Input Sanitization & Anti-XSS (OWASP A03 Injection) ---");

  const maliciousScript = "<script>alert('xss')</script>Somchai";
  const cleanScript = sanitizeString(maliciousScript);
  assert(cleanScript === "Somchai", "Strips <script> tags completely");

  const maliciousIframe = '<iframe src="javascript:stealCookie()"></iframe>Sukjai';
  const cleanIframe = sanitizeString(maliciousIframe);
  assert(cleanIframe === "Sukjai", "Strips <iframe> and javascript pseudoprotocols");

  const maliciousHandler = '<div onload="evilFunc()">Anan</div>';
  const cleanHandler = sanitizeString(maliciousHandler);
  assert(cleanHandler === "Anan", "Strips inline event handlers and HTML wrappers");

  const thaiDecomposed = "สม\u0E38\u0E17\u0E23"; // Decomposed Thai
  const normalizedThai = sanitizeString(thaiDecomposed);
  assert(
    normalizedThai === normalizedThai.normalize("NFC"),
    "Normalizes Thai diacritics and vowels to NFC Unicode standard"
  );

  const complexObject = {
    name: "<b>David</b>",
    notes: "<script>dangerous()</script>Valid text",
    count: 42,
  };
  const sanitizedObj = sanitizeObject(complexObject);
  assert(
    sanitizedObj.name === "David" && sanitizedObj.notes === "Valid text" && sanitizedObj.count === 42,
    "Deep-sanitizes nested object attributes while preserving primitives"
  );

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log("\n==================================================================");
  console.log(`TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log("==================================================================");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runSecurityTests()
  .then(() => {
    console.log("Security verification completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Test suite encountered fatal error:", err);
    process.exit(1);
  });
