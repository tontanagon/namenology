import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const settingsSchema = z.object({
  version: z.string().min(1).max(20),
  description: z.string().optional(),
  decimalPrecision: z.number().int().min(0).max(6),
  missingFieldPolicy: z.enum(["REDISTRIBUTE_WEIGHT", "SKIP"]),
  normalizationMaxScore: z.number().int().min(10).max(1000),
  activateImmediately: z.boolean().default(true),
});

export async function GET() {
  try {
    await requireAdmin();

    const activeConfig = await prisma.analysisConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    const allConfigs = await prisma.analysisConfig.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      activeConfig,
      allConfigs,
    });
  } catch (error) {
    console.error("Failed to load settings:", error);
    return NextResponse.json(
      { error: "Failed to retrieve settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await req.json();
    const validated = settingsSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid configuration data", details: validated.error.format() },
        { status: 400 }
      );
    }

    const {
      version,
      description,
      decimalPrecision,
      missingFieldPolicy,
      normalizationMaxScore,
      activateImmediately,
    } = validated.data;

    const newConfig = await prisma.$transaction(async (tx) => {
      // If activating immediately, deactivate current active configs
      if (activateImmediately) {
        await tx.analysisConfig.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      const created = await tx.analysisConfig.create({
        data: {
          version,
          scorePrecision: decimalPrecision,
          missingFieldPolicy,
          isActive: activateImmediately,
        },
      });

      await tx.adminAuditLog.create({
        data: {
          adminUserId: admin.id,
          action: "BUMP_FORMULA_VERSION",
          targetType: "AnalysisConfig",
          targetId: created.id,
          metadata: { newValue: created, description },
        },
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      config: newConfig,
    });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json(
      { error: "Failed to save analysis settings." },
      { status: 500 }
    );
  }
}
