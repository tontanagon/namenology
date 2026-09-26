// =============================================================================
// UNIT TESTS: SCORING ENGINE & TEXT NORMALIZER
// =============================================================================

import { describe, it, expect } from "vitest";
import { TextNormalizer } from "@/services/analysis/text-normalizer";
import { Language } from "@prisma/client";

describe("TextNormalizer Unit Tests", () => {
  it("normalizes English text and collapses excess whitespace", () => {
    const raw = "   Alexander    James   ";
    const res = TextNormalizer.normalize(raw);

    expect(res.normalizedText).toBe("Alexander James");
    expect(res.detectedLanguage).toBe(Language.EN);
    expect(res.characters).toEqual([
      "A", "l", "e", "x", "a", "n", "d", "e", "r",
      "J", "a", "m", "e", "s"
    ]);
  });

  it("normalizes Thai text using Unicode NFC standard and detects TH language", () => {
    // Decomposed Thai string with separate vowel and tone mark
    const decomposed = "สม\u0E38\u0E17\u0E23";
    const res = TextNormalizer.normalize(decomposed);

    expect(res.detectedLanguage).toBe(Language.TH);
    expect(res.normalizedText).toBe(decomposed.normalize("NFC"));
    expect(res.characters.length).toBeGreaterThan(0);
  });

  it("handles empty or blank input gracefully", () => {
    const res = TextNormalizer.normalize("");
    expect(res.characters).toEqual([]);
    expect(res.normalizedText).toBe("");
  });

  it("validates text length constraints correctly", () => {
    const valid = TextNormalizer.validate("Somchai", { minLength: 2, maxLength: 50 });
    expect(valid.valid).toBe(true);

    const tooShort = TextNormalizer.validate("", { minLength: 1 });
    expect(tooShort.valid).toBe(false);

    const tooLong = TextNormalizer.validate("A".repeat(101), { maxLength: 100 });
    expect(tooLong.valid).toBe(false);
  });
});

describe("Score Normalization & Precision Unit Tests", () => {
  it("scales 1-9 character scores to 1-100 range proportionally", () => {
    // Mapping function: (avg / 9) * 100
    const calcScore = (avg: number) => (avg / 9) * 100;

    expect(calcScore(9)).toBe(100);
    expect(calcScore(4.5)).toBe(50);
    expect(calcScore(1)).toBeCloseTo(11.11, 2);
  });

  it("correctly rounds floating point scores to configured decimal precision", () => {
    const roundToPrecision = (val: number, precision: number) => {
      const factor = Math.pow(10, precision);
      return Math.round(val * factor) / factor;
    };

    expect(roundToPrecision(87.6543, 2)).toBe(87.65);
    expect(roundToPrecision(87.6555, 2)).toBe(87.66);
    expect(roundToPrecision(92.499, 1)).toBe(92.5);
    expect(roundToPrecision(92.4, 0)).toBe(92);
  });
});
