// =============================================================================
// NUMEROLOGY MEANING REPOSITORY
// Data access layer for comprehensive 1-100 numerology destiny articles,
// titles, group associations, life predictions, and health vulnerabilities.
// =============================================================================

import { prisma } from "@/lib/prisma";
import { NumerologyMeaning } from "@prisma/client";
import { getNumerologyMeaningByNumber, NUMEROLOGY_MEANINGS_1_TO_100 } from "@/lib/data/numerology-meanings";

export class NumerologyMeaningRepository {
  /**
   * Retrieves the numerology meaning for a specific number (1 - 100).
   * Falls back to in-memory JSON dataset if database query returns null.
   */
  async getByNumber(num: number): Promise<NumerologyMeaning | null> {
    try {
      const match = await prisma.numerologyMeaning.findUnique({
        where: { number: num },
      });
      if (match) return match;
    } catch {
      // In case database is temporarily unavailable during testing or build
    }

    // In-memory fallback
    const fallback = getNumerologyMeaningByNumber(num);
    if (!fallback) return null;

    return {
      id: `fallback-${num}`,
      number: fallback.number,
      rootNumber: fallback.rootNumber,
      groupNumber: fallback.groupNumber,
      title: fallback.title,
      category: fallback.category,
      meaningsAndSymbols: fallback.meaningsAndSymbols,
      groupCharacteristics: fallback.groupCharacteristics,
      lifeDescription: fallback.lifeDescription,
      shadowPolarity: fallback.shadowPolarity,
      beWaryOf: fallback.beWaryOf,
      illnesses: fallback.illnesses,
      loveAndFamily: fallback.loveAndFamily,
      exampleNames: fallback.exampleNames,
      language: "en",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Returns all 100 numerology meanings ordered by number ascending.
   */
  async listAll(): Promise<NumerologyMeaning[]> {
    try {
      const list = await prisma.numerologyMeaning.findMany({
        where: { isActive: true },
        orderBy: { number: "asc" },
      });
      if (list.length > 0) return list;
    } catch {
      // fallback
    }

    return NUMEROLOGY_MEANINGS_1_TO_100.map((item) => ({
      id: `fallback-${item.number}`,
      number: item.number,
      rootNumber: item.rootNumber,
      groupNumber: item.groupNumber,
      title: item.title,
      category: item.category,
      meaningsAndSymbols: item.meaningsAndSymbols,
      groupCharacteristics: item.groupCharacteristics,
      lifeDescription: item.lifeDescription,
      shadowPolarity: item.shadowPolarity,
      beWaryOf: item.beWaryOf,
      illnesses: item.illnesses,
      loveAndFamily: item.loveAndFamily,
      exampleNames: item.exampleNames,
      language: "en",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  /**
   * Retrieves all numbers associated with a specific root number group (1 - 9).
   */
  async listByGroup(groupNumber: number): Promise<NumerologyMeaning[]> {
    try {
      return await prisma.numerologyMeaning.findMany({
        where: { groupNumber, isActive: true },
        orderBy: { number: "asc" },
      });
    } catch {
      return (await this.listAll()).filter((m) => m.groupNumber === groupNumber);
    }
  }
}

export const numerologyMeaningRepository = new NumerologyMeaningRepository();
