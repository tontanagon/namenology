// =============================================================================
// CHARACTER MAPPER SERVICE
// Maps normalized characters to numeric scores based on database configuration
// =============================================================================

import { characterScoreRepository } from "@/repositories/character-score.repository";
import { Language } from "@prisma/client";

export interface MappedCharacter {
  character: string;
  lookupKey: string;
  position: number;
  score: number;
}

export interface CharacterMappingResult {
  mappedCharacters: MappedCharacter[];
  unsupportedCharacters: string[];
  totalScore: number;
  averageScore: number;
}

export class CharacterMapper {
  /**
   * Maps an array of characters to their configured scores.
   * English characters are matched case-insensitively.
   */
  static async mapCharacters(
    characters: string[],
    language: Language
  ): Promise<CharacterMappingResult> {
    const activeScores = await characterScoreRepository.getActiveScores(language);

    // Build lookup dictionary
    const scoreMap = new Map<string, number>();
    for (const item of activeScores) {
      scoreMap.set(item.character, item.score);
    }

    const mappedCharacters: MappedCharacter[] = [];
    const unsupportedCharacters: string[] = [];
    let totalScore = 0;

    characters.forEach((char, index) => {
      // For English, lookup with uppercase
      const lookupKey = language === Language.EN ? char.toUpperCase() : char;
      const score = scoreMap.get(lookupKey);

      if (score !== undefined) {
        mappedCharacters.push({
          character: char,
          lookupKey,
          position: index + 1,
          score,
        });
        totalScore += score;
      } else {
        unsupportedCharacters.push(char);
      }
    });

    const averageScore =
      mappedCharacters.length > 0 ? totalScore / mappedCharacters.length : 0;

    return {
      mappedCharacters,
      unsupportedCharacters,
      totalScore,
      averageScore,
    };
  }
}
