// =============================================================================
// SCORING SERVICE — CORE NAMENOLOGY CALCULATION ENGINE
// Implements dynamic weights, component aggregation, missing field redistribution,
// score normalization (1-100), and interpretation resolution.
// =============================================================================

import { nameComponentRepository } from "@/repositories/name-component.repository";
import { analysisConfigRepository } from "@/repositories/analysis-config.repository";
import { scoreInterpretationRepository } from "@/repositories/score-interpretation.repository";
import { TextNormalizer } from "./text-normalizer";
import { CharacterMapper, MappedCharacter } from "./character-mapper";
import { MissingFieldPolicy } from "@prisma/client";

export interface ComponentInput {
  key: string;
  text: string;
}

export interface CalculatedComponent {
  componentKey: string;
  label: string;
  inputText: string;
  normalizedText: string;
  score: number;
  weightConfigured: number;
  weightEffective: number;
  mappedCharacters: MappedCharacter[];
}

export interface CalculationResult {
  rawScore: number;
  finalScore: number;
  calculationVersion: string;
  components: CalculatedComponent[];
  allCharacters: {
    componentKey: string;
    character: string;
    position: number;
    mappedScore: number;
  }[];
  interpretation: {
    category: string;
    title: string;
    description: string;
    recommendation: string | null;
  } | null;
  configSnapshot: Record<string, unknown>;
}

export class ScoringService {
  /**
   * Calculates scores for provided name components according to active database rules.
   */
  static async calculate(
    inputs: ComponentInput[],
    languagePreference = "en"
  ): Promise<CalculationResult> {
    const activeConfig = await analysisConfigRepository.getActive();
    const enabledComponents = await nameComponentRepository.getEnabled();

    // 1. Process each input component and map character scores
    const calculatedComponents: CalculatedComponent[] = [];
    const allCharacters: CalculationResult["allCharacters"] = [];

    for (const input of inputs) {
      const trimmed = input.text ? input.text.trim() : "";
      if (!trimmed) continue;

      const compConfig = enabledComponents.find((c) => c.key === input.key);
      const configuredWeight = compConfig ? Number(compConfig.weight) : 0;
      const label = compConfig ? compConfig.label : input.key;

      const normalized = TextNormalizer.normalize(trimmed);
      const mapping = await CharacterMapper.mapCharacters(
        normalized.characters,
        normalized.detectedLanguage
      );

      if (mapping.unsupportedCharacters.length > 0) {
        throw new Error(
          `Unsupported character(s) in ${label}: "${mapping.unsupportedCharacters.join(
            ", "
          )}".`
        );
      }

      // Component Score = average score of its characters
      // To ensure a rich 1-100 scale, traditional numerology average is scaled or mapped:
      // In seed data: character scores are 1-9. Scaling 1-9 average to 1-100 scale: (avg / 9) * 100 or sum numerology.
      // Per Section 3 of docs/ANALYSIS_ENGINE.md: raw score is in 1-100 range.
      // When characters are 1-9, (average / 9) * 100 produces 1-100 score:
      const componentScore =
        mapping.mappedCharacters.length > 0
          ? (mapping.averageScore / 9) * 100
          : 0;

      calculatedComponents.push({
        componentKey: input.key,
        label,
        inputText: input.text,
        normalizedText: normalized.normalizedText,
        score: componentScore,
        weightConfigured: configuredWeight,
        weightEffective: configuredWeight, // will be recalculated below
        mappedCharacters: mapping.mappedCharacters,
      });

      mapping.mappedCharacters.forEach((mc) => {
        allCharacters.push({
          componentKey: input.key,
          character: mc.character,
          position: mc.position,
          mappedScore: mc.score,
        });
      });
    }

    if (calculatedComponents.length === 0) {
      throw new Error("At least one name component with valid input is required.");
    }

    // 2. Apply Missing Field Policy (docs/ANALYSIS_ENGINE.md Section 5)
    // Calculate effective weights
    const activeWeightSum = calculatedComponents.reduce(
      (sum, c) => sum + c.weightConfigured,
      0
    );

    if (activeWeightSum > 0) {
      if (
        activeConfig.missingFieldPolicy === MissingFieldPolicy.REDISTRIBUTE_WEIGHT ||
        calculatedComponents.length < enabledComponents.length
      ) {
        // Proportionally redistribute weights so sum of active weights equals 100%
        calculatedComponents.forEach((c) => {
          c.weightEffective = (c.weightConfigured / activeWeightSum) * 100;
        });
      }
    } else {
      // Fallback: equal weight distribution if all configured weights are 0
      const equalWeight = 100 / calculatedComponents.length;
      calculatedComponents.forEach((c) => {
        c.weightEffective = equalWeight;
      });
    }

    // 3. Compute weighted raw score
    const rawScore = calculatedComponents.reduce(
      (sum, c) => sum + c.score * (c.weightEffective / 100),
      0
    );

    // 4. Normalize score to 1-100 scale and round to precision (Section 7)
    const factor = Math.pow(10, activeConfig.scorePrecision);
    const rounded = Math.round(rawScore * factor) / factor;
    const finalScore = Math.max(1, Math.min(100, rounded));

    // 5. Resolve interpretation from database
    const interp = await scoreInterpretationRepository.resolveInterpretation(
      finalScore,
      languagePreference
    );

    // 6. Freeze configuration snapshot for historical reproducibility (REQ-B24)
    const configSnapshot = {
      version: activeConfig.version,
      precision: activeConfig.scorePrecision,
      missingFieldPolicy: activeConfig.missingFieldPolicy,
      components: enabledComponents.map((c) => ({
        key: c.key,
        weight: Number(c.weight),
        isEnabled: c.isEnabled,
      })),
      calculatedAt: new Date().toISOString(),
    };

    return {
      rawScore,
      finalScore,
      calculationVersion: activeConfig.version,
      components: calculatedComponents,
      allCharacters,
      interpretation: interp
        ? {
            category: interp.category,
            title: interp.title,
            description: interp.description,
            recommendation: interp.recommendation,
          }
        : null,
      configSnapshot,
    };
  }
}
