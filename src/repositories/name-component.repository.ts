// =============================================================================
// NAME COMPONENT REPOSITORY
// Data access layer for configurable name components and weight parameters
// =============================================================================

import { prisma } from "@/lib/prisma";
import { NameComponent } from "@prisma/client";

export class NameComponentRepository {
  /**
   * Retrieves all name components ordered by sort order.
   */
  async getAll(): Promise<NameComponent[]> {
    return prisma.nameComponent.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  /**
   * Retrieves only enabled name components.
   */
  async getEnabled(): Promise<NameComponent[]> {
    return prisma.nameComponent.findMany({
      where: { isEnabled: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  /**
   * Finds a component by its unique key (e.g. FIRST_NAME, SURNAME).
   */
  async findByKey(key: string): Promise<NameComponent | null> {
    return prisma.nameComponent.findUnique({
      where: { key },
    });
  }

  /**
   * Validates that the sum of weights of all enabled components equals exactly 100.00.
   */
  async validateTotalWeight(): Promise<boolean> {
    const enabled = await this.getEnabled();
    const total = enabled.reduce((sum, c) => sum + Number(c.weight), 0);
    return Math.abs(total - 100) < 0.01;
  }
}

export const nameComponentRepository = new NameComponentRepository();
