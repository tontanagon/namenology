import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
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
      include: {
        product: true,
      },
    });

    if (!serviceOrder) {
      return NextResponse.json(
        { error: "Service order not found" },
        { status: 404 }
      );
    }

    if (serviceOrder.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied to this service order" },
        { status: 403 }
      );
    }

    return NextResponse.json({ serviceOrder });
  } catch (error) {
    console.error("Failed to fetch service order:", error);
    return NextResponse.json(
      { error: "Failed to retrieve service order" },
      { status: 500 }
    );
  }
}
