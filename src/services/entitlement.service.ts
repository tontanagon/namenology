// =============================================================================
// ENTITLEMENT SERVICE — QUOTA & CREDIT LEDGER MANAGEMENT
// Implements independent quota buckets, concurrency-safe credit reservation,
// and audit tracking per REQ-B03, REQ-B04, REQ-B11, REQ-B12, REQ-B14, and REQ-B50.
// =============================================================================

import { prisma } from "@/lib/prisma";
import { creditLedgerRepository } from "@/repositories/credit-ledger.repository";
import { CreditType, CreditSourceType, Prisma } from "@prisma/client";

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

export interface UserEntitlementSummary {
  userId: string;
  balances: Record<CreditType, number>;
  canAnalyze: {
    firstName: boolean;
    surname: boolean;
    combined: boolean;
  };
  totalEarned: Record<CreditType, number>;
  totalConsumed: Record<CreditType, number>;
}

export class EntitlementService {
  /**
   * Retrieves comprehensive credit balance summary and permissions for a user.
   */
  async getUserEntitlements(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<UserEntitlementSummary> {
    const client = tx ?? prisma;

    const entries = await client.creditLedger.groupBy({
      by: ["creditType"],
      where: { userId },
      _sum: { amount: true },
    });

    const balances: Record<CreditType, number> = {
      [CreditType.FIRST_NAME]: 0,
      [CreditType.SURNAME]: 0,
      [CreditType.COMBINED]: 0,
    };

    for (const entry of entries) {
      balances[entry.creditType] = Math.max(0, entry._sum.amount ?? 0);
    }

    // Also calculate total earned and total consumed for auditing
    const grants = await client.creditLedger.groupBy({
      by: ["creditType"],
      where: { userId, amount: { gt: 0 } },
      _sum: { amount: true },
    });

    const deductions = await client.creditLedger.groupBy({
      by: ["creditType"],
      where: { userId, amount: { lt: 0 } },
      _sum: { amount: true },
    });

    const totalEarned: Record<CreditType, number> = {
      [CreditType.FIRST_NAME]: 0,
      [CreditType.SURNAME]: 0,
      [CreditType.COMBINED]: 0,
    };
    const totalConsumed: Record<CreditType, number> = {
      [CreditType.FIRST_NAME]: 0,
      [CreditType.SURNAME]: 0,
      [CreditType.COMBINED]: 0,
    };

    for (const g of grants) totalEarned[g.creditType] = g._sum.amount ?? 0;
    for (const d of deductions) totalConsumed[d.creditType] = Math.abs(d._sum.amount ?? 0);

    return {
      userId,
      balances,
      canAnalyze: {
        firstName: balances[CreditType.FIRST_NAME] > 0,
        surname: balances[CreditType.SURNAME] > 0,
        combined: balances[CreditType.COMBINED] > 0,
      },
      totalEarned,
      totalConsumed,
    };
  }

  /**
   * Verifies whether a user has enough credit to perform an analysis.
   */
  async canAnalyzeUser(
    userId: string,
    creditType: CreditType,
    tx?: Prisma.TransactionClient
  ): Promise<{ allowed: boolean; available: number }> {
    const balance = await creditLedgerRepository.getBalance(userId, creditType, tx);
    return {
      allowed: balance > 0,
      available: Math.max(0, balance),
    };
  }

  /**
   * Atomically checks balance and consumes 1 credit inside a transaction.
   * Throws InsufficientCreditsError if balance is less than 1.
   * (REQ-B04, REQ-B14 prevents race conditions and double spending).
   */
  async consumeCredit(
    userId: string,
    creditType: CreditType,
    sourceId?: string,
    tx?: Prisma.TransactionClient
  ) {
    const execute = async (client: Prisma.TransactionClient) => {
      // Re-query balance inside transaction with row-level integrity
      const currentBalance = await creditLedgerRepository.getBalance(
        userId,
        creditType,
        client
      );

      if (currentBalance < 1) {
        throw new InsufficientCreditsError(creditType, currentBalance);
      }

      // Record negative ledger entry (-1)
      return client.creditLedger.create({
        data: {
          userId,
          creditType,
          amount: -1,
          sourceType: CreditSourceType.PURCHASE,
          sourceId: sourceId || null,
        },
      });
    };

    if (tx) {
      return execute(tx);
    }

    return prisma.$transaction(async (newTx) => execute(newTx));
  }

  /**
   * Grants credits to a user from a specific source (PURCHASE, FREE, ADMIN_ADJUSTMENT).
   */
  async grantCredits(
    userId: string,
    creditType: CreditType,
    amount: number,
    sourceType: CreditSourceType,
    sourceId?: string,
    tx?: Prisma.TransactionClient
  ) {
    if (amount <= 0) {
      throw new Error("Credit grant amount must be positive.");
    }

    const client = tx ?? prisma;
    return client.creditLedger.create({
      data: {
        userId,
        creditType,
        amount,
        sourceType,
        sourceId: sourceId || null,
      },
    });
  }

  /**
   * Retrieves transaction history of the credit ledger for auditing and user dashboard.
   */
  async getLedgerHistory(
    userId: string,
    options?: { limit?: number; offset?: number; creditType?: CreditType }
  ) {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    const where: Prisma.CreditLedgerWhereInput = {
      userId,
      ...(options?.creditType ? { creditType: options.creditType } : {}),
    };

    const [entries, total] = await Promise.all([
      prisma.creditLedger.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.creditLedger.count({ where }),
    ]);

    return { entries, total, limit, offset };
  }
}

export const entitlementService = new EntitlementService();
