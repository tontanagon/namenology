import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { CreditType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(10, Number(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { email: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          creditLedgerEntries: {
            select: {
              creditType: true,
              amount: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ]);

    // Compute credit balances dynamically per REQ-B50
    const formatted = users.map((u) => {
      const balances: Record<CreditType, number> = {
        [CreditType.FIRST_NAME]: 0,
        [CreditType.SURNAME]: 0,
        [CreditType.COMBINED]: 0,
      };

      for (const entry of u.creditLedgerEntries) {
        balances[entry.creditType] = (balances[entry.creditType] || 0) + entry.amount;
      }

      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt,
        balances: {
          firstName: Math.max(0, balances[CreditType.FIRST_NAME]),
          surname: Math.max(0, balances[CreditType.SURNAME]),
          combined: Math.max(0, balances[CreditType.COMBINED]),
        },
      };
    });

    return NextResponse.json({
      users: formatted,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Failed to load users for admin:", error);
    return NextResponse.json(
      { error: "Failed to retrieve users." },
      { status: 500 }
    );
  }
}
