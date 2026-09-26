// =============================================================================
// SCORE INTERPRETATION REPOSITORY
// Data access layer for range-based auspiciousness interpretations
// =============================================================================

import { prisma } from "@/lib/prisma";
import { ScoreInterpretation } from "@prisma/client";

export class ScoreInterpretationRepository {
  /**
   * Resolves the interpretation record matching a normalized score (1 - 100).
   */
  async resolveInterpretation(
    score: number,
    language = "en"
  ): Promise<ScoreInterpretation | null> {
    const clampedScore = Math.max(1, Math.min(100, Math.round(score)));

    const match = await prisma.scoreInterpretation.findFirst({
      where: {
        language,
        isActive: true,
        scoreMin: { lte: clampedScore },
        scoreMax: { gte: clampedScore },
      },
    });

    if (match) {
      return match;
    }

    // Fallback if specific language is missing: try "en"
    if (language !== "en") {
      return prisma.scoreInterpretation.findFirst({
        where: {
          language: "en",
          isActive: true,
          scoreMin: { lte: clampedScore },
          scoreMax: { gte: clampedScore },
        },
      });
    }

    return null;
  }
}

export const scoreInterpretationRepository = new ScoreInterpretationRepository();
