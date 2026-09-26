// =============================================================================
// UNIT TESTS: SECURITY, RATE LIMITING & SANITIZATION
// =============================================================================

import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { sanitizeString, escapeHtml, sanitizeObject } from "@/lib/security/sanitize";
import { redactSensitiveData } from "@/lib/logger";

describe("Security & Cryptography Unit Tests", () => {
  it("hashes password with Argon2id and verifies valid password correctly", async () => {
    const rawPassword = "P@ssw0rdSecure2026!";
    const hash = await hashPassword(rawPassword);

    expect(hash).toContain("$argon2id$");

    const isMatch = await verifyPassword(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isMismatch = await verifyPassword("WrongPassword123!", hash);
    expect(isMismatch).toBe(false);
  });
});

describe("Anti-XSS & Input Sanitization Unit Tests", () => {
  it("strips script tags, iframes, and javascript protocols", () => {
    const xssVectors = [
      "<script>alert(1)</script>Somchai",
      '<iframe src="javascript:evil()"></iframe>Somchai',
      '<a href="javascript:alert(1)">Somchai</a>',
      '<img src="x" onerror="steal()" />Somchai',
    ];

    for (const vector of xssVectors) {
      expect(sanitizeString(vector)).toBe("Somchai");
    }
  });

  it("escapes dangerous HTML characters safely", () => {
    const untrusted = '<div class="test">Somchai & Sukjai</div>';
    const escaped = escapeHtml(untrusted);

    expect(escaped).not.toContain("<");
    expect(escaped).not.toContain(">");
    expect(escaped).toContain("&lt;div");
    expect(escaped).toContain("&amp;");
  });

  it("recursively sanitizes complex objects", () => {
    const input = {
      name: "<b>David</b>",
      tags: ["<i>VIP</i>", "Normal"],
      nested: {
        comment: "<script>evil()</script>Great service!",
      },
    };

    const sanitized = sanitizeObject(input);
    expect(sanitized.name).toBe("David");
    expect(sanitized.tags).toEqual(["VIP", "Normal"]);
    expect(sanitized.nested.comment).toBe("Great service!");
  });
});

describe("Sensitive Data Redaction Unit Tests", () => {
  it("recursively redacts passwords, tokens, credit cards, and secrets", () => {
    const payload = {
      user: {
        id: "usr_1",
        email: "user@example.com",
        password: "secretPassword",
        passwordHash: "$argon2id$...",
      },
      payment: {
        cardNumber: "4111222233334444",
        cvv: "999",
        stripeSecretKey: "sk_live_123456789",
      },
      publicInfo: {
        role: "USER",
        tier: "GOLD",
      },
    };

    const redacted = redactSensitiveData(payload) as any;

    expect(redacted.user.email).toBe("user@example.com");
    expect(redacted.user.password).toBe("[REDACTED]");
    expect(redacted.user.passwordHash).toBe("[REDACTED]");
    expect(redacted.payment.cardNumber).toBe("[REDACTED]");
    expect(redacted.payment.cvv).toBe("[REDACTED]");
    expect(redacted.payment.stripeSecretKey).toBe("[REDACTED]");
    expect(redacted.publicInfo.tier).toBe("GOLD");
  });
});
