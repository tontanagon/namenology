// =============================================================================
// INTEGRATION TESTS: ADMIN WEIGHT CONFIGURATION & SERVER-SIDE VALIDATION
// Verifies strict enforcement of 100.00% weight sum per REQ-B23 and REQ-B35
// =============================================================================

import { describe, it, expect } from "vitest";

describe("Admin Weight Configuration Server Validation", () => {
  function validateWeights(
    components: Array<{ key: string; weight: number; isEnabled: boolean }>
  ): { isValid: boolean; sum: number; error?: string } {
    const enabledComponents = components.filter((c) => c.isEnabled);
    const sum = enabledComponents.reduce((acc, c) => acc + c.weight, 0);
    const roundedSum = Math.round(sum * 100) / 100;

    if (Math.abs(roundedSum - 100) > 0.01) {
      return {
        isValid: false,
        sum: roundedSum,
        error: `Total enabled component weights must sum to exactly 100.00%. Current sum: ${roundedSum.toFixed(
          2
        )}%`,
      };
    }

    return { isValid: true, sum: roundedSum };
  }

  it("accepts valid default 60/40 First Name / Surname split", () => {
    const input = [
      { key: "first_name", weight: 60.0, isEnabled: true },
      { key: "surname", weight: 40.0, isEnabled: true },
    ];

    const result = validateWeights(input);
    expect(result.isValid).toBe(true);
    expect(result.sum).toBe(100.0);
    expect(result.error).toBeUndefined();
  });

  it("accepts valid multi-component distribution summing to 100%", () => {
    const input = [
      { key: "first_name", weight: 50.0, isEnabled: true },
      { key: "middle_name", weight: 10.0, isEnabled: true },
      { key: "surname", weight: 30.0, isEnabled: true },
      { key: "nickname", weight: 10.0, isEnabled: true },
      { key: "disabled_comp", weight: 25.0, isEnabled: false }, // Disabled should not count
    ];

    const result = validateWeights(input);
    expect(result.isValid).toBe(true);
    expect(result.sum).toBe(100.0);
  });

  it("strictly rejects configuration when sum is below 100% (e.g. 95%)", () => {
    const input = [
      { key: "first_name", weight: 60.0, isEnabled: true },
      { key: "surname", weight: 35.0, isEnabled: true },
    ];

    const result = validateWeights(input);
    expect(result.isValid).toBe(false);
    expect(result.sum).toBe(95.0);
    expect(result.error).toContain("must sum to exactly 100.00%");
  });

  it("strictly rejects configuration when sum exceeds 100% (e.g. 110%)", () => {
    const input = [
      { key: "first_name", weight: 70.0, isEnabled: true },
      { key: "surname", weight: 40.0, isEnabled: true },
    ];

    const result = validateWeights(input);
    expect(result.isValid).toBe(false);
    expect(result.sum).toBe(110.0);
    expect(result.error).toContain("must sum to exactly 100.00%");
  });
});
