// =============================================================================
// CREDIT LEDGER REPOSITORY
// Implements auditable transaction history & real-time balance calculations
// per ADR-003, REQ-B03, REQ-B04, REQ-B12, and REQ-B14.
// =============================================================================

import { prisma } from "@/lib/prisma";
import { CreditType, CreditSourceType, CreditLedger, Prisma } from "@prisma/client";

export class CreditLedgerRepository {
  /**
   * Calculates real-time balance for a given user and credit type.
   * Balance = SUM(amount) FROM credit_ledger
   */
  async getBalance(
    userId: string,
    creditType: CreditType,
    tx?: Prisma.TransactionClient
  ): Promise<number> {
    const client = tx ?? prisma;
    const aggregate = await client.creditLedger.aggregate({
      where: { userId, creditType },
      _sum: { amount: true },
    });
    return aggregate._sum.amount ?? 0;
  }

  /**
   * Retrieves all balances for a user across all 3 credit types.
   */
  async getAllBalances(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Record<CreditType, number>> {
    const client = tx ?? prisma;
    const records = await client.creditLedger.groupBy({
      by: ["creditType"],
      where: { userId },
      _sum: { amount: true },
    });

    const balances: Record<CreditType, number> = {
      [CreditType.FIRST_NAME]: 0,
      [CreditType.SURNAME]: 0,
      [CreditType.COMBINED]: 0,
    };

    for (const r of records) {
      balances[r.creditType] = r._sum.amount ?? 0;
    }

    return balances;
  }

  /**
   * Records a credit grant or consumption entry.
   * amount > 0 for grants, amount < 0 for consumption.
   */
  async recordEntry(
    data: {
      userId: string;
      creditType: CreditType;
      amount: number;
      sourceType: CreditSourceType;
      sourceId?: string;
    },
    tx?: Prisma.TransactionClient
  ): Promise<CreditLedger> {
    const client = tx ?? prisma;
    return client.creditLedger.create({
      data: {
        userId: data.userId,
        creditType: data.creditType,
        amount: data.amount,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
      },
    });
  }
}

export const creditLedgerRepository = new CreditLedgerRepository();
