// =============================================================================
// ANALYSIS CONFIG REPOSITORY
// Data access layer for versioned calculation rules and system parameters
// =============================================================================

import { prisma } from "@/lib/prisma";
import { AnalysisConfig, MissingFieldPolicy } from "@prisma/client";

export class AnalysisConfigRepository {
  /**
   * Retrieves the currently active analysis configuration.
   * If no active configuration exists, returns safe system defaults.
   */
  async getActive(): Promise<AnalysisConfig> {
    const active = await prisma.analysisConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (active) {
      return active;
    }

    // Fallback default if not seeded
    return {
      id: "default",
      version: "1.0",
      freeFirstNameLimit: 0,
      freeSurnameLimit: 0,
      freeCombinedLimit: 0,
      scorePrecision: 2,
      missingFieldPolicy: MissingFieldPolicy.REDISTRIBUTE_WEIGHT,
      minInputLength: 1,
      maxInputLength: 100,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Finds a configuration by exact version string (for historical audits).
   */
  async findByVersion(version: string): Promise<AnalysisConfig | null> {
    return prisma.analysisConfig.findUnique({
      where: { version },
    });
  }
}

export const analysisConfigRepository = new AnalysisConfigRepository();
