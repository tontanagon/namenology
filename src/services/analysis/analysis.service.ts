// =============================================================================
// ANALYSIS SERVICE — BUSINESS ORCHESTRATION LAYER
// Enforces entitlements, transaction-safe credit deduction, calculation execution,
// and structured result persistence (REQ-B04, B14, B15, B24, B38, B46).
// =============================================================================

import { prisma } from "@/lib/prisma";
import { creditLedgerRepository } from "@/repositories/credit-ledger.repository";
import { analysisRepository } from "@/repositories/analysis.repository";
import { ScoringService } from "./scoring.service";
import { CreditType, CreditSourceType, Prisma } from "@prisma/client";
import {
  reduceToRootNumber,
  getNumerologyGroup,
} from "@/lib/data/numerology-groups";

export class InsufficientCreditsError extends Error {
  creditType: CreditType;
  available: number;

  constructor(creditType: CreditType, available: number) {
    super(
      `Insufficient ${creditType} credits. You currently have ${available} credit(s).`
    );
    this.name = "InsufficientCreditsError";
    this.creditType = creditType;
    this.available = available;
  }
}

export interface ExecuteAnalysisParams {
  userId: string;
  analysisType: CreditType;
  firstName?: string;
  surname?: string;
  languagePreference?: string;
}

export class AnalysisService {
  /**
   * Executes a complete name analysis with transaction safety:
   * 1. Checks available credit balance
   * 2. Runs algorithmic calculation
   * 3. Atomically consumes credit and persists result in database
   */
  async executeAnalysis(params: ExecuteAnalysisParams) {
    const { userId, analysisType, firstName, surname, languagePreference = "en" } =
      params;

    // 1. Validate required inputs based on analysis type (REQ-B18, B19, B20)
    const inputs: { key: string; text: string }[] = [];

    if (analysisType === CreditType.FIRST_NAME) {
      if (!firstName || !firstName.trim()) {
        throw new Error("Official First Name is required for Official First Name Analysis.");
      }
      inputs.push({ key: "FIRST_NAME", text: firstName.trim() });
    } else if (analysisType === CreditType.SURNAME) {
      if (!surname || !surname.trim()) {
        throw new Error("Official Surname is required for Official Surname Analysis.");
      }
      inputs.push({ key: "SURNAME", text: surname.trim() });
    } else if (analysisType === CreditType.COMBINED) {
      if (!firstName || !firstName.trim() || !surname || !surname.trim()) {
        throw new Error(
          "Both Official First Name and Official Surname are required for Combined Analysis."
        );
      }
      inputs.push({ key: "FIRST_NAME", text: firstName.trim() });
      inputs.push({ key: "SURNAME", text: surname.trim() });
    }

    // 2. Check entitlement balance (Unified credit pool)
    const cbBalance = await creditLedgerRepository.getBalance(
      userId,
      CreditType.COMBINED
    );
    const fnBalance = await creditLedgerRepository.getBalance(
      userId,
      CreditType.FIRST_NAME
    );
    const snBalance = await creditLedgerRepository.getBalance(
      userId,
      CreditType.SURNAME
    );

    let deductionType: "COMBINED" | "PAIR" | "SINGLE" = "COMBINED";

    if (analysisType === CreditType.COMBINED) {
      if (cbBalance >= 1) {
        deductionType = "COMBINED";
      } else if (fnBalance >= 1 && snBalance >= 1) {
        deductionType = "PAIR";
      } else {
        throw new InsufficientCreditsError(
          CreditType.COMBINED,
          cbBalance + Math.min(fnBalance, snBalance)
        );
      }
    } else {
      deductionType = "SINGLE";
      const singleBal =
        analysisType === CreditType.FIRST_NAME ? fnBalance : snBalance;
      if (singleBal < 1) {
        throw new InsufficientCreditsError(analysisType, singleBal);
      }
    }

    // 3. Execute algorithmic calculation (no credit consumed yet!)
    const calculation = await ScoringService.calculate(
      inputs,
      languagePreference
    );

    const fullInputText = inputs.map((i) => i.text).join(" ");
    const fullNormalizedText = calculation.components
      .map((c) => c.normalizedText)
      .join(" ");

    // 4. Transaction-safe atomic execution: Deduct credit + Save analysis record
    const result = await prisma.$transaction(async (tx) => {
      // Create analysis record with frozen config snapshot (REQ-B24)
      const createdAnalysis = await analysisRepository.createAnalysis(
        {
          userId,
          analysisType,
          inputText: fullInputText,
          normalizedText: fullNormalizedText,
          rawScore: calculation.rawScore,
          finalScore: calculation.finalScore,
          calculationVersion: calculation.calculationVersion,
          configSnapshot: calculation.configSnapshot as Prisma.InputJsonValue,
          components: calculation.components.map((c) => ({
            componentKey: c.componentKey,
            inputText: c.inputText,
            score: c.score,
            weightUsed: c.weightEffective,
          })),
          characterDetails: calculation.allCharacters.map((cd) => ({
            componentKey: cd.componentKey,
            character: cd.character,
            position: cd.position,
            mappedScore: cd.mappedScore,
          })),
        },
        tx
      );

      // Deduct from the auditable credit ledger
      if (deductionType === "COMBINED") {
        await creditLedgerRepository.recordEntry(
          {
            userId,
            creditType: CreditType.COMBINED,
            amount: -1,
            sourceType: CreditSourceType.PURCHASE,
            sourceId: createdAnalysis.id,
          },
          tx
        );
      } else if (deductionType === "PAIR") {
        await creditLedgerRepository.recordEntry(
          {
            userId,
            creditType: CreditType.FIRST_NAME,
            amount: -1,
            sourceType: CreditSourceType.PURCHASE,
            sourceId: createdAnalysis.id,
          },
          tx
        );
        await creditLedgerRepository.recordEntry(
          {
            userId,
            creditType: CreditType.SURNAME,
            amount: -1,
            sourceType: CreditSourceType.PURCHASE,
            sourceId: createdAnalysis.id,
          },
          tx
        );
      } else {
        await creditLedgerRepository.recordEntry(
          {
            userId,
            creditType: analysisType,
            amount: -1,
            sourceType: CreditSourceType.PURCHASE,
            sourceId: createdAnalysis.id,
          },
          tx
        );
      }

      return createdAnalysis;
    });

    // 5. Return structured, machine-readable response (REQ-B46)
    return {
      id: result.id,
      analysisType,
      input: fullInputText,
      normalizedText: fullNormalizedText,
      score: calculation.finalScore,
      rawScore: calculation.rawScore,
      calculationVersion: calculation.calculationVersion,
      interpretation: calculation.interpretation,
      components: calculation.components.map((c) => ({
        key: c.componentKey,
        label: c.label,
        inputText: c.inputText,
        score: c.score,
        weight: c.weightEffective,
        characters: c.mappedCharacters.map((mc) => ({
          character: mc.character,
          score: mc.score,
          position: mc.position,
        })),
      })),
      createdAt: result.createdAt,
    };
  }

  /**
   * Retrieves past analysis history for a user.
   */
  async getUserHistory(
    userId: string,
    options?: { limit?: number; offset?: number; type?: CreditType }
  ) {
    return analysisRepository.listByUser(userId, options);
  }

  /**
   * Retrieves a specific analysis with verification that the user owns the record.
   */
  async getAnalysisById(analysisId: string, userId: string, isAdmin = false) {
    const analysis = await analysisRepository.findById(analysisId);
    if (!analysis) {
      return null;
    }

    if (analysis.userId !== userId && !isAdmin) {
      throw new Error("Access denied to this analysis report");
    }

    const totalCompoundSum = analysis.characterDetails.reduce(
      (sum, cd) => sum + cd.mappedScore,
      0
    );
    const rootNumber = reduceToRootNumber(totalCompoundSum);
    const numerologyGroup = getNumerologyGroup(totalCompoundSum);

    return {
      ...analysis,
      finalScore: Number(analysis.finalScore),
      rawScore: Number(analysis.rawScore),
      totalCompoundSum,
      rootNumber,
      numerologyGroup,
      components: analysis.components.map((c) => ({
        id: c.id,
        key: c.componentKey,
        componentKey: c.componentKey,
        label:
          c.componentKey === "FIRST_NAME"
            ? "Official First Name"
            : c.componentKey === "SURNAME"
            ? "Official Surname"
            : c.componentKey === "MIDDLE_NAME"
            ? "Middle Name"
            : c.componentKey === "NICKNAME"
            ? "Daily Call Name"
            : "Combined Synergy",
        inputText: c.inputText,
        score: Number(c.score),
        weight: Number(c.weightUsed),
        weightUsed: Number(c.weightUsed),
        characters: analysis.characterDetails
          .filter((cd) => cd.componentKey === c.componentKey)
          .map((cd) => ({
            character: cd.character,
            score: cd.mappedScore,
            position: cd.position,
          })),
      })),
    };
  }
}

export const analysisService = new AnalysisService();
