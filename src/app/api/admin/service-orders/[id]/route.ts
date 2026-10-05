import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { ServiceOrderStatus, Prisma } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchServiceOrderSchema = z.object({
  status: z.nativeEnum(ServiceOrderStatus).optional(),
  notes: z.string().optional(),
  resultDelivery: z.string().optional(),
  assignedAdminId: z.string().uuid().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const validated = patchServiceOrderSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid service order update parameters", details: validated.error.format() },
        { status: 400 }
      );
    }

    const existing = await prisma.serviceOrder.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Service order not found" }, { status: 404 });
    }

    const dataToUpdate: Prisma.ServiceOrderUpdateInput = {};
    if (validated.data.status !== undefined) dataToUpdate.status = validated.data.status;
    if (validated.data.notes !== undefined) dataToUpdate.notes = validated.data.notes;
    if (validated.data.resultDelivery !== undefined) {
      dataToUpdate.resultData = { findings: validated.data.resultDelivery };
    }
    if (validated.data.assignedAdminId !== undefined) {
      dataToUpdate.assignedAdmin = validated.data.assignedAdminId
        ? { connect: { id: validated.data.assignedAdminId } }
        : { disconnect: true };
    }

    const updated = await prisma.$transaction(async (tx) => {
      const record = await tx.serviceOrder.update({
        where: { id },
        data: dataToUpdate,
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: true,
        },
      });

      await tx.adminAuditLog.create({
        data: {
          adminUserId: admin.id,
          action: "UPDATE_SERVICE_ORDER",
          targetType: "ServiceOrder",
          targetId: record.id,
          metadata: { oldValue: { status: existing.status }, newValue: { status: record.status } },
        },
      });

      return record;
    });

    return NextResponse.json({
      success: true,
      serviceOrder: updated,
    });
  } catch (error) {
    console.error("Failed to update service order:", error);
    return NextResponse.json(
      { error: "Failed to update service order." },
      { status: 500 }
    );
  }
}
