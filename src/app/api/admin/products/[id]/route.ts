import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const productPatchSchema = z.object({
  price: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
  stripePriceId: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();

    const body = await req.json();
    const validated = productPatchSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid product parameters", details: validated.error.format() },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const record = await tx.product.update({
        where: { id: params.id },
        data: {
          price: validated.data.price !== undefined ? validated.data.price : existing.price,
          isActive: validated.data.isActive !== undefined ? validated.data.isActive : existing.isActive,
          description: validated.data.description !== undefined ? validated.data.description : existing.description,
          stripePriceId: validated.data.stripePriceId !== undefined ? validated.data.stripePriceId : existing.stripePriceId,
        },
        include: { entitlements: true },
      });

      await tx.adminAuditLog.create({
        data: {
          adminUserId: admin.id,
          action: "UPDATE_PRODUCT_CATALOG",
          targetType: "Product",
          targetId: record.id,
          metadata: {
            oldValue: { price: Number(existing.price), isActive: existing.isActive },
            newValue: { price: Number(record.price), isActive: record.isActive },
          },
        },
      });

      return record;
    });

    return NextResponse.json({
      success: true,
      product: updated,
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product catalog." },
      { status: 500 }
    );
  }
}
