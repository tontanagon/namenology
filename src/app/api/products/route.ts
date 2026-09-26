// =============================================================================
// PRODUCTS API ROUTE — GET /api/products
// Returns active products with explicit entitlement breakdowns per REQ-B01, B30, B31
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        entitlements: {
          orderBy: { creditType: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      products: products.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description,
        productType: p.productType,
        price: Number(p.price),
        currency: p.currency,
        sortOrder: p.sortOrder,
        entitlements: p.entitlements.map((e) => ({
          creditType: e.creditType,
          quantity: e.quantity,
        })),
      })),
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve product catalog." },
      { status: 500 }
    );
  }
}
