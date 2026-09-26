// =============================================================================
// UNIT TESTS: WEIGHT CALCULATION & REDISTRIBUTION
// =============================================================================

import { describe, it, expect } from "vitest";

describe("Weight Calculation & Dynamic Redistribution", () => {
  it("calculates standard 60/40 First Name / Surname split", () => {
    const firstNameScore = 80;
    const surnameScore = 90;
    const weights = { firstName: 60, surname: 40 };

    const totalWeight = weights.firstName + weights.surname;
    expect(totalWeight).toBe(100);

    const weightedScore =
      firstNameScore * (weights.firstName / 100) +
      surnameScore * (weights.surname / 100);

    // 80 * 0.6 = 48, 90 * 0.4 = 36 -> 48 + 36 = 84
    expect(weightedScore).toBe(84);
  });

  it("redistributes weight to 100% when only single component is analyzed", () => {
    const components = [
      { key: "first_name", score: 85, weightConfigured: 60 },
    ];

    const activeSum = components.reduce((sum, c) => sum + c.weightConfigured, 0);
    const calculated = components.map((c) => ({
      ...c,
      weightEffective: (c.weightConfigured / activeSum) * 100,
    }));

    expect(calculated[0].weightEffective).toBe(100);
    const finalScore = calculated.reduce(
      (sum, c) => sum + c.score * (c.weightEffective / 100),
      0
    );
    expect(finalScore).toBe(85);
  });

  it("proportionally redistributes weight when optional component is omitted", () => {
    // 3 components configured: First Name (50%), Middle Name (10%), Surname (40%)
    // Middle Name is omitted by user
    const presentComponents = [
      { key: "first_name", score: 80, weightConfigured: 50 },
      { key: "surname", score: 90, weightConfigured: 40 },
    ];

    const activeWeightSum = presentComponents.reduce(
      (sum, c) => sum + c.weightConfigured,
      0
    );
    expect(activeWeightSum).toBe(90);

    const effective = presentComponents.map((c) => ({
      ...c,
      weightEffective: (c.weightConfigured / activeWeightSum) * 100,
    }));

    expect(effective[0].weightEffective).toBeCloseTo(55.556, 3);
    expect(effective[1].weightEffective).toBeCloseTo(44.444, 3);

    const sumEffective = effective.reduce((sum, c) => sum + c.weightEffective, 0);
    expect(sumEffective).toBeCloseTo(100, 5);

    const finalScore = effective.reduce(
      (sum, c) => sum + c.score * (c.weightEffective / 100),
      0
    );
    // 80 * (50/90) + 90 * (40/90) = 44.444 + 40 = 84.444
    expect(finalScore).toBeCloseTo(84.444, 2);
  });

  it("validates that active component weights must sum to exactly 100%", () => {
    const validateWeightSum = (weights: number[]) => {
      const sum = weights.reduce((acc, w) => acc + w, 0);
      return Math.abs(sum - 100) < 0.01;
    };

    expect(validateWeightSum([60, 40])).toBe(true);
    expect(validateWeightSum([50, 20, 30])).toBe(true);
    expect(validateWeightSum([33.33, 33.33, 33.34])).toBe(true);

    expect(validateWeightSum([60, 30])).toBe(false); // 90%
    expect(validateWeightSum([70, 40])).toBe(false); // 110%
    expect(validateWeightSum([])).toBe(false);        // 0%
  });
});
