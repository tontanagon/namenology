import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  score: z.number().int().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const validated = updateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validated.error.format() },
        { status: 400 }
      );
    }

    const existing = await prisma.characterScore.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Character score record not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const record = await tx.characterScore.update({
        where: { id },
        data: {
          score: validated.data.score !== undefined ? validated.data.score : existing.score,
          isActive: validated.data.isActive !== undefined ? validated.data.isActive : existing.isActive,
        },
      });

      // Record Audit Log (REQ-B23, REQ-B48)
      await tx.adminAuditLog.create({
        data: {
          adminUserId: admin.id,
          action: "UPDATE_CHARACTER_SCORE",
          targetType: "CharacterScore",
          targetId: record.id,
          metadata: {
            oldValue: { score: existing.score, isActive: existing.isActive },
            newValue: { score: record.score, isActive: record.isActive },
          },
        },
      });

      return record;
    });

    return NextResponse.json({
      success: true,
      character: updated,
    });
  } catch (error) {
    console.error("Failed to update character score:", error);
    return NextResponse.json(
      { error: "Failed to update character score" },
      { status: 500 }
    );
  }
}
