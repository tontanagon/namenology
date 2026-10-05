import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { ServiceOrderStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const serviceOrder = await prisma.serviceOrder.findUnique({
      where: { id },
    });

    if (!serviceOrder) {
      return NextResponse.json(
        { error: "Service order not found" },
        { status: 404 }
      );
    }

    if (serviceOrder.userId !== user.id) {
      return NextResponse.json(
        { error: "Access denied to this service order" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { formData, notes } = body;

    if (!formData || typeof formData !== "object") {
      return NextResponse.json(
        { error: "Please provide valid form information." },
        { status: 400 }
      );
    }

    const updated = await prisma.serviceOrder.update({
      where: { id: serviceOrder.id },
      data: {
        formData: formData as Prisma.InputJsonValue,
        notes: notes ? String(notes) : serviceOrder.notes,
        status: ServiceOrderStatus.FORM_SUBMITTED,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      success: true,
      serviceOrder: updated,
    });
  } catch (error) {
    console.error("Failed to submit service intake form:", error);
    return NextResponse.json(
      { error: "Failed to submit service order details." },
      { status: 500 }
    );
  }
}
