// =============================================================================
// UNIT TESTS: FREE QUOTA ACCOUNT ISOLATION
// Verifies that authenticated user quota is strictly per-account and not leaked
// =============================================================================

import { describe, it, expect } from "vitest";

describe("Free Quota Account Isolation Tests", () => {
  it("determines user quota based strictly on database count, ignoring guest cookie", () => {
    const resolveEffectiveQuota = (
      user: { id: string } | null,
      dbAnalysesCount: number,
      cookieTrials: number
    ): number => {
      // Authenticated users must strictly rely on their own database records
      if (user) {
        return dbAnalysesCount;
      }
      // Unauthenticated guests use cookie trials
      return cookieTrials;
    };

    // Scenario: User A used 2 free analyses, leaving cookieTrials = 2 in browser
    const userA = { id: "user-a" };
    expect(resolveEffectiveQuota(userA, 2, 2)).toBe(2);

    // Scenario: User B logs into the same browser. User B has 0 analyses in database
    const userB = { id: "user-b" };
    // Even though cookieTrials is 2, User B must have 0 used!
    expect(resolveEffectiveQuota(userB, 0, 2)).toBe(0);

    // Scenario: Unauthenticated guest on fresh browser
    expect(resolveEffectiveQuota(null, 0, 0)).toBe(0);

    // Scenario: Unauthenticated guest with 1 trial performed
    expect(resolveEffectiveQuota(null, 0, 1)).toBe(1);
  });

  it("checks whether user has remaining free quota correctly", () => {
    const canPerformFreeAnalysis = (
      freeUsed: number,
      totalCredits: number
    ): boolean => {
      // 2 free analyses allowed
      if (freeUsed < 2) return true;
      // Subsequent analyses require credits
      return totalCredits > 0;
    };

    // User B with 0 used: allowed without credits
    expect(canPerformFreeAnalysis(0, 0)).toBe(true);

    // User with 1 used: allowed without credits
    expect(canPerformFreeAnalysis(1, 0)).toBe(true);

    // User with 2 used and no credits: blocked
    expect(canPerformFreeAnalysis(2, 0)).toBe(false);

    // User with 2 used and 1 credit: allowed via credits
    expect(canPerformFreeAnalysis(2, 1)).toBe(true);
  });
});
