import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { entitlementService } from "@/services/entitlement.service";
import { CreditType, CreditSourceType } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const adjustSchema = z.object({
  creditType: z.nativeEnum(CreditType),
  amount: z.number().int().refine((val) => val !== 0, "Amount cannot be zero"),
  reason: z.string().min(3, "Please provide a reason for the credit adjustment"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();

    const body = await req.json();
    const validated = adjustSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid adjustment data", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { creditType, amount, reason } = validated.data;

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Atomic credit grant / deduction and audit logging
    await prisma.$transaction(async (tx) => {
      await tx.creditLedger.create({
        data: {
          userId: targetUser.id,
          creditType,
          amount,
          sourceType: CreditSourceType.ADMIN_ADJUSTMENT,
          sourceId: `admin_${admin.id}`,
        },
      });

      await tx.adminAuditLog.create({
        data: {
          adminUserId: admin.id,
          action: "MANUAL_CREDIT_ADJUSTMENT",
          targetType: "User",
          targetId: targetUser.id,
          metadata: {
            creditType,
            amount,
            reason,
          },
        },
      });
    });

    const updatedBalances = await entitlementService.getUserEntitlements(targetUser.id);

    return NextResponse.json({
      success: true,
      balances: updatedBalances.balances,
    });
  } catch (error) {
    console.error("Failed to adjust credits:", error);
    return NextResponse.json(
      { error: "Failed to adjust user credits." },
      { status: 500 }
    );
  }
}
