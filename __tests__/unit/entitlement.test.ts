// =============================================================================
// UNIT TESTS: ENTITLEMENT & QUOTA LOGIC
// =============================================================================

import { describe, it, expect } from "vitest";
import { InsufficientCreditsError } from "@/services/entitlement.service";
import { CreditType } from "@prisma/client";

describe("Entitlement & Quota Logic Unit Tests", () => {
  it("creates InsufficientCreditsError with appropriate credit type and balance", () => {
    const error = new InsufficientCreditsError(CreditType.COMBINED, 0);

    expect(error.name).toBe("InsufficientCreditsError");
    expect(error.creditType).toBe(CreditType.COMBINED);
    expect(error.available).toBe(0);
    expect(error.message).toContain("Insufficient COMBINED credits");
  });

  it("calculates permission flags correctly based on bucket balances", () => {
    const checkPermissions = (balances: Record<CreditType, number>) => ({
      canAnalyzeFirstName: (balances[CreditType.FIRST_NAME] ?? 0) > 0,
      canAnalyzeSurname: (balances[CreditType.SURNAME] ?? 0) > 0,
      canAnalyzeCombined: (balances[CreditType.COMBINED] ?? 0) > 0,
    });

    // 1. Initial Free Plan: 2 First Name, 2 Surname, 0 Combined
    const freePlan = checkPermissions({
      [CreditType.FIRST_NAME]: 2,
      [CreditType.SURNAME]: 2,
      [CreditType.COMBINED]: 0,
    });
    expect(freePlan.canAnalyzeFirstName).toBe(true);
    expect(freePlan.canAnalyzeSurname).toBe(true);
    expect(freePlan.canAnalyzeCombined).toBe(false); // Combined blocked on free tier per REQ-B02, B40

    // 2. Exhausted Free Plan: 0 First Name, 1 Surname, 0 Combined
    const partiallyExhausted = checkPermissions({
      [CreditType.FIRST_NAME]: 0,
      [CreditType.SURNAME]: 1,
      [CreditType.COMBINED]: 0,
    });
    expect(partiallyExhausted.canAnalyzeFirstName).toBe(false);
    expect(partiallyExhausted.canAnalyzeSurname).toBe(true);
    expect(partiallyExhausted.canAnalyzeCombined).toBe(false);

    // 3. Paid Package Plan: 10 First Name, 10 Surname, 5 Combined
    const paidPlan = checkPermissions({
      [CreditType.FIRST_NAME]: 10,
      [CreditType.SURNAME]: 10,
      [CreditType.COMBINED]: 5,
    });
    expect(paidPlan.canAnalyzeFirstName).toBe(true);
    expect(paidPlan.canAnalyzeSurname).toBe(true);
    expect(paidPlan.canAnalyzeCombined).toBe(true);
  });

  it("calculates net balance from ledger transactions correctly", () => {
    const mockLedgerEntries = [
      { type: CreditType.FIRST_NAME, amount: 2 },  // Initial Free Grant
      { type: CreditType.FIRST_NAME, amount: -1 }, // Used in Analysis #1
      { type: CreditType.FIRST_NAME, amount: 10 }, // Purchased Package
      { type: CreditType.FIRST_NAME, amount: -1 }, // Used in Analysis #2
    ];

    const balance = mockLedgerEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalEarned = mockLedgerEntries
      .filter((e) => e.amount > 0)
      .reduce((sum, e) => sum + e.amount, 0);
    const totalConsumed = mockLedgerEntries
      .filter((e) => e.amount < 0)
      .reduce((sum, e) => sum + Math.abs(e.amount), 0);

    expect(balance).toBe(10);
    expect(totalEarned).toBe(12);
    expect(totalConsumed).toBe(2);
  });
});
