import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const componentUpdateSchema = z.object({
  components: z.array(
    z.object({
      id: z.string().uuid(),
      weight: z.number().min(0).max(100),
      isEnabled: z.boolean(),
      isRequired: z.boolean(),
      sortOrder: z.number().int(),
    })
  ),
});

export async function GET() {
  try {
    await requireAdmin();

    const components = await prisma.nameComponent.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ components });
  } catch (error) {
    console.error("Failed to load components:", error);
    return NextResponse.json(
      { error: "Failed to retrieve components" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await req.json();
    const validated = componentUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid component payload", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { components } = validated.data;

    // Server-side validation: Enabled weights must sum to exactly 100.00% (REQ-B35)
    const enabledSum = components
      .filter((c) => c.isEnabled)
      .reduce((sum, c) => sum + c.weight, 0);

    if (Math.abs(enabledSum - 100) > 0.01) {
      return NextResponse.json(
        {
          error: `Enabled component weights must sum to exactly 100.00%. Current sum: ${enabledSum.toFixed(
            2
          )}%`,
        },
        { status: 400 }
      );
    }

    // Execute atomic update & audit log
    await prisma.$transaction(async (tx) => {
      for (const comp of components) {
        await tx.nameComponent.update({
          where: { id: comp.id },
          data: {
            weight: comp.weight,
            isEnabled: comp.isEnabled,
            isRequired: comp.isRequired,
            sortOrder: comp.sortOrder,
          },
        });
      }

      await tx.adminAuditLog.create({
        data: {
          adminUserId: admin.id,
          action: "UPDATE_COMPONENT_WEIGHTS",
          targetType: "NameComponent",
          targetId: "ALL",
          metadata: { newValue: components },
        },
      });
    });

    const updatedComponents = await prisma.nameComponent.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      components: updatedComponents,
    });
  } catch (error) {
    console.error("Failed to update components:", error);
    return NextResponse.json(
      { error: "Failed to update component weights." },
      { status: 500 }
    );
  }
}
