import { describe, it, expect } from "vitest";
import {
  NUMEROLOGY_MEANINGS_1_TO_100,
  getNumerologyMeaningByNumber,
} from "@/lib/data/numerology-meanings";
import { getNumerologyGroup, reduceToRootNumber } from "@/lib/data/numerology-groups";
import chaldeanScores from "@/lib/data/character_scores_chaldean.json";
import { numerologyMeaningRepository } from "@/repositories/numerology-meaning.repository";
import { scoreInterpretationRepository } from "@/repositories/score-interpretation.repository";

describe("Numerology Meanings & Chaldean Letter Scores Migration", () => {
  it("should have all 26 English letters mapped accurately according to ref/score_text.txt", () => {
    const scores = chaldeanScores as Record<string, number>;
    // Check all 26 letters
    for (let c = 65; c <= 90; c++) {
      const char = String.fromCharCode(c);
      expect(scores[char]).toBeDefined();
      expect(scores[char]).toBeGreaterThanOrEqual(1);
      expect(scores[char]).toBeLessThanOrEqual(8);
    }

    // Specific Chaldean groups validation
    expect(scores["A"]).toBe(1);
    expect(scores["I"]).toBe(1);
    expect(scores["J"]).toBe(1);
    expect(scores["Q"]).toBe(1);
    expect(scores["Y"]).toBe(1);

    expect(scores["B"]).toBe(2);
    expect(scores["K"]).toBe(2);
    expect(scores["R"]).toBe(2);

    expect(scores["C"]).toBe(3);
    expect(scores["G"]).toBe(3);
    expect(scores["L"]).toBe(3);
    expect(scores["S"]).toBe(3);

    expect(scores["D"]).toBe(4);
    expect(scores["M"]).toBe(4);
    expect(scores["T"]).toBe(4);

    expect(scores["E"]).toBe(5);
    expect(scores["H"]).toBe(5);
    expect(scores["N"]).toBe(5);
    expect(scores["X"]).toBe(5);

    expect(scores["U"]).toBe(6);
    expect(scores["V"]).toBe(6);
    expect(scores["W"]).toBe(6);

    expect(scores["O"]).toBe(7);
    expect(scores["Z"]).toBe(7);

    expect(scores["F"]).toBe(8);
    expect(scores["P"]).toBe(8);
  });

  it("should contain all 100 numerology meanings with titles and descriptions", () => {
    expect(NUMEROLOGY_MEANINGS_1_TO_100.length).toBe(100);

    for (let i = 1; i <= 100; i++) {
      const item = NUMEROLOGY_MEANINGS_1_TO_100[i - 1];
      expect(item.number).toBe(i);
      expect(item.title).toBeTruthy();
      expect(item.groupNumber).toBeGreaterThanOrEqual(1);
      expect(item.groupNumber).toBeLessThanOrEqual(9);
      expect(item.groupCharacteristics.length).toBeGreaterThan(0);
      expect(item.lifeDescription.length).toBeGreaterThan(0);
    }

    // Check milestone titles
    expect(getNumerologyMeaningByNumber(1).title).toBe("THE LEADER");
    expect(getNumerologyMeaningByNumber(14).title).toBe("GREATNESS");
    expect(getNumerologyMeaningByNumber(23).title).toBe("ABSOLUTE CHARM");
    expect(getNumerologyMeaningByNumber(24).title).toBe("JOY LIFE");
    expect(getNumerologyMeaningByNumber(50).title).toBe("ENTHUSIASM");
    expect(getNumerologyMeaningByNumber(100).title).toBe("AMBITIOUS");
  });

  it("should resolve compound numbers to exact articles in getNumerologyGroup", () => {
    const article24 = getNumerologyGroup(24);
    expect(article24.title).toBe("JOY LIFE");
    expect(article24.groupNumber).toBe(6);
    expect(article24.lifeDescription).toContain("The number 24");

    const article100 = getNumerologyGroup(100);
    expect(article100.title).toBe("AMBITIOUS");
    expect(article100.groupNumber).toBe(1);

    // Reduction logic
    expect(reduceToRootNumber(24)).toBe(6);
    expect(reduceToRootNumber(100)).toBe(1);
  });

  it("should resolve interpretation from repository for individual score", async () => {
    const interp = await scoreInterpretationRepository.resolveInterpretation(24);
    expect(interp).not.toBeNull();
    expect(interp?.title).toBe("JOY LIFE");
    expect(interp?.scoreMin).toBe(24);
    expect(interp?.scoreMax).toBe(24);
  });

  it("should query numerology meaning repository successfully", async () => {
    const meaning = await numerologyMeaningRepository.getByNumber(14);
    expect(meaning).not.toBeNull();
    expect(meaning?.title).toBe("GREATNESS");
    expect(meaning?.groupNumber).toBe(5);
  });
});
