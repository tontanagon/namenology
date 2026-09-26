import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceOrders = await prisma.serviceOrder.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            code: true,
            name: true,
            price: true,
            currency: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ serviceOrders });
  } catch (error) {
    console.error("Failed to fetch service orders:", error);
    return NextResponse.json(
      { error: "Failed to retrieve service orders" },
      { status: 500 }
    );
  }
}
