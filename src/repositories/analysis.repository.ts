// =============================================================================
// ANALYSIS REPOSITORY
// Data access layer for persisting and retrieving calculated name analyses
// =============================================================================

import { prisma } from "@/lib/prisma";
import { CreditType, Analysis, Prisma } from "@prisma/client";

export interface CreateAnalysisInput {
  userId: string;
  analysisType: CreditType;
  inputText: string;
  normalizedText: string;
  rawScore: number;
  finalScore: number;
  calculationVersion: string;
  configSnapshot?: Prisma.InputJsonValue;
  components: {
    componentKey: string;
    inputText: string;
    score: number;
    weightUsed: number;
  }[];
  characterDetails: {
    componentKey: string;
    character: string;
    position: number;
    mappedScore: number;
  }[];
}

export class AnalysisRepository {
  /**
   * Creates an analysis record along with its component breakdowns and character details.
   */
  async createAnalysis(
    input: CreateAnalysisInput,
    tx?: Prisma.TransactionClient
  ): Promise<Analysis> {
    const client = tx ?? prisma;

    return client.analysis.create({
      data: {
        userId: input.userId,
        analysisType: input.analysisType,
        inputText: input.inputText,
        normalizedText: input.normalizedText,
        rawScore: new Prisma.Decimal(input.rawScore),
        finalScore: new Prisma.Decimal(input.finalScore),
        calculationVersion: input.calculationVersion,
        configSnapshot: input.configSnapshot,
        components: {
          create: input.components.map((c) => ({
            componentKey: c.componentKey,
            inputText: c.inputText,
            score: new Prisma.Decimal(c.score),
            weightUsed: new Prisma.Decimal(c.weightUsed),
          })),
        },
        characterDetails: {
          create: input.characterDetails.map((cd) => ({
            componentKey: cd.componentKey,
            character: cd.character,
            position: cd.position,
            mappedScore: cd.mappedScore,
          })),
        },
      },
      include: {
        components: true,
        characterDetails: true,
      },
    });
  }

  /**
   * Finds an analysis by ID including components and character breakdown.
   */
  async findById(id: string) {
    return prisma.analysis.findUnique({
      where: { id },
      include: {
        components: {
          orderBy: { createdAt: "asc" },
        },
        characterDetails: {
          orderBy: [{ componentKey: "asc" }, { position: "asc" }],
        },
      },
    });
  }

  /**
   * Lists analyses for a specific user with pagination.
   */
  async listByUser(
    userId: string,
    options?: { limit?: number; offset?: number; type?: CreditType }
  ) {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    const where: Prisma.AnalysisWhereInput = {
      userId,
      ...(options?.type ? { analysisType: options.type } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.analysis.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          components: true,
        },
      }),
      prisma.analysis.count({ where }),
    ]);

    return { items, total, limit, offset };
  }
}

export const analysisRepository = new AnalysisRepository();
