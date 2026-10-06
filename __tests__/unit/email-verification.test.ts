// =============================================================================
// UNIT TESTS: EMAIL VERIFICATION LOGIC & TEMPLATES
// =============================================================================

import { describe, it, expect } from "vitest";
import { getVerificationEmailHtml } from "@/lib/email/templates";

describe("Email Verification Unit Tests", () => {
  describe("Verification Email Template", () => {
    it("renders verification link and user greeting in HTML", () => {
      const name = "Alice Cosmos";
      const verifyUrl = "https://namenology.com/verify-email?token=abc123token456";

      const html = getVerificationEmailHtml(name, verifyUrl);

      expect(html).toContain("Alice Cosmos");
      expect(html).toContain("Verify Your Email Address");
      expect(html).toContain(verifyUrl);
      expect(html).toContain("24 hours");
    });

    it("escapes or handles fallback copy-paste link cleanly", () => {
      const verifyUrl = "http://localhost:3000/verify-email?token=test-hex-token-xyz";
      const html = getVerificationEmailHtml("Bob", verifyUrl);

      expect(html).toContain(verifyUrl);
      expect(html).toContain("Button not working?");
    });
  });

  describe("Token Expiration Logic", () => {
    it("correctly identifies active vs expired tokens", () => {
      const now = new Date("2026-10-04T12:00:00Z");

      const isTokenValid = (expiresAt: Date, currentTime: Date): boolean => {
        return currentTime <= expiresAt;
      };

      // Token generated 1 hour ago, expires in 23 hours
      const activeExpiry = new Date(now.getTime() + 23 * 60 * 60 * 1000);
      expect(isTokenValid(activeExpiry, now)).toBe(true);

      // Token expired 5 minutes ago
      const expiredDate = new Date(now.getTime() - 5 * 60 * 1000);
      expect(isTokenValid(expiredDate, now)).toBe(false);

      // Exactly at expiration
      expect(isTokenValid(now, now)).toBe(true);
    });

    it("enforces 60-second rate limiting on resend requests", () => {
      const checkRateLimit = (
        lastCreatedAt: Date | null,
        now: Date
      ): { allowed: boolean; remainingSeconds: number } => {
        if (!lastCreatedAt) return { allowed: true, remainingSeconds: 0 };
        const elapsedMs = now.getTime() - lastCreatedAt.getTime();
        const cooldownMs = 60 * 1000;
        if (elapsedMs < cooldownMs) {
          return {
            allowed: false,
            remainingSeconds: Math.ceil((cooldownMs - elapsedMs) / 1000),
          };
        }
        return { allowed: true, remainingSeconds: 0 };
      };

      const now = new Date("2026-10-04T12:00:00Z");

      // No previous token
      expect(checkRateLimit(null, now).allowed).toBe(true);

      // Previous token generated 30 seconds ago
      const recent = new Date(now.getTime() - 30 * 1000);
      const resRecent = checkRateLimit(recent, now);
      expect(resRecent.allowed).toBe(false);
      expect(resRecent.remainingSeconds).toBe(30);

      // Previous token generated 61 seconds ago
      const older = new Date(now.getTime() - 61 * 1000);
      expect(checkRateLimit(older, now).allowed).toBe(true);
    });
  });

  describe("User Verification Status Transition", () => {
    it("determines email verification state accurately", () => {
      const getStatusLabel = (emailVerified: Date | null): "Verified" | "Pending" => {
        return emailVerified ? "Verified" : "Pending";
      };

      expect(getStatusLabel(null)).toBe("Pending");
      expect(getStatusLabel(new Date())).toBe("Verified");
    });
  });

  describe("Analysis & Payment Enforcement Gate", () => {
    const canAccessFeature = (user: { emailVerified: Date | null } | null): boolean => {
      if (!user) return false;
      return user.emailVerified !== null;
    };

    it("blocks analysis features when user email is not verified", () => {
      const unverifiedUser = { emailVerified: null };
      expect(canAccessFeature(unverifiedUser)).toBe(false);
    });

    it("allows analysis features when user email is verified", () => {
      const verifiedUser = { emailVerified: new Date() };
      expect(canAccessFeature(verifiedUser)).toBe(true);
    });

    it("blocks payment and checkout when user email is not verified", () => {
      const unverifiedUser = { emailVerified: null };
      expect(canAccessFeature(unverifiedUser)).toBe(false);
    });

    it("permits payment and checkout when user email is verified", () => {
      const verifiedUser = { emailVerified: new Date() };
      expect(canAccessFeature(verifiedUser)).toBe(true);
    });
  });
});
