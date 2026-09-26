import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();

    const products = await prisma.product.findMany({
      include: {
        entitlements: true,
      },
      orderBy: [{ productType: "asc" }, { price: "asc" }],
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Failed to load products:", error);
    return NextResponse.json(
      { error: "Failed to retrieve products." },
      { status: 500 }
    );
  }
}
