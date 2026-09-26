// =============================================================================
// NUMEROLOGY MEANINGS (1 - 100) COMPLETE KNOWLEDGE REPOSITORY
// Parsed directly from ref/Numerology_Meanings_1-100_Edited.docx
// Contains deterministic archetypes, titles, group associations,
// life predictions, health vulnerabilities, illnesses, and power names.
// =============================================================================

import rawMeanings from "./numerology_meanings_1_to_100.json";

export interface NumerologyMeaningItem {
  number: number;
  rootNumber: number;
  groupNumber: number;
  title: string;
  category: "AUSPICIOUS" | "BALANCED" | "NEEDS_OPTIMIZATION" | string;
  meaningsAndSymbols: string;
  groupCharacteristics: string;
  lifeDescription: string;
  shadowPolarity: string;
  beWaryOf: string;
  illnesses: string;
  loveAndFamily: string;
  exampleNames: string;
  rawContent: string;
}

export const NUMEROLOGY_MEANINGS_1_TO_100: NumerologyMeaningItem[] = rawMeanings as NumerologyMeaningItem[];

const MEANINGS_MAP: Map<number, NumerologyMeaningItem> = new Map(
  NUMEROLOGY_MEANINGS_1_TO_100.map((item) => [item.number, item])
);

/**
 * Returns the numerology meaning item for any number 1-100.
 * Falls back to root number reduction if number > 100.
 */
export function getNumerologyMeaningByNumber(num: number): NumerologyMeaningItem {
  if (!num || num <= 0) {
    return MEANINGS_MAP.get(1)!;
  }

  if (num <= 100 && MEANINGS_MAP.has(num)) {
    return MEANINGS_MAP.get(num)!;
  }

  // If > 100, reduce by summing digits
  const sumOfDigits = num
    .toString()
    .split("")
    .reduce((sum, d) => sum + (parseInt(d, 10) || 0), 0);

  if (sumOfDigits <= 100 && MEANINGS_MAP.has(sumOfDigits)) {
    return MEANINGS_MAP.get(sumOfDigits)!;
  }

  // Fallback to root (1-9)
  const root = num % 9 === 0 ? 9 : num % 9;
  return MEANINGS_MAP.get(root) || MEANINGS_MAP.get(1)!;
}
