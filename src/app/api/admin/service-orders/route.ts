import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { ServiceOrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status as ServiceOrderStatus;
    }

    const serviceOrders = await prisma.serviceOrder.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        product: {
          select: { id: true, code: true, name: true, price: true },
        },
        order: {
          select: { id: true, status: true, amount: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ serviceOrders });
  } catch (error) {
    console.error("Failed to load service orders for admin:", error);
    return NextResponse.json(
      { error: "Failed to retrieve service orders." },
      { status: 500 }
    );
  }
}
