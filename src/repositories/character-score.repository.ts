// =============================================================================
// CHARACTER SCORE REPOSITORY
// Data access layer for active character scores with in-memory caching
// =============================================================================

import { prisma } from "@/lib/prisma";
import { Language, CharacterScore } from "@prisma/client";

// Cache for character scores to minimize database roundtrips during calculation
let cachedScores: CharacterScore[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

export class CharacterScoreRepository {
  /**
   * Retrieves all active character scores for a specific language or all languages.
   */
  async getActiveScores(language?: Language): Promise<CharacterScore[]> {
    const now = Date.now();
    if (!cachedScores || now - lastCacheTime > CACHE_TTL_MS) {
      cachedScores = await prisma.characterScore.findMany({
        where: { isActive: true },
      });
      lastCacheTime = now;
    }

    if (language) {
      return cachedScores.filter((s) => s.language === language);
    }
    return cachedScores;
  }

  /**
   * Finds a character score for a given character and language.
   */
  async findScore(character: string, language: Language): Promise<CharacterScore | null> {
    const scores = await this.getActiveScores(language);
    return (
      scores.find(
        (s) => s.character === character && s.language === language
      ) ?? null
    );
  }

  /**
   * Clears in-memory cache when Admin updates character scores.
   */
  static clearCache() {
    cachedScores = null;
    lastCacheTime = 0;
  }
}

export const characterScoreRepository = new CharacterScoreRepository();
