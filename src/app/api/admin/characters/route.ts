import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { Language } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const langParam = searchParams.get("language");
    const search = searchParams.get("search");
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(10, Number(searchParams.get("limit") || "50")));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (langParam === "TH" || langParam === "EN") {
      where.language = langParam as Language;
    }
    if (search && search.trim()) {
      where.character = { contains: search.trim(), mode: "insensitive" };
    }

    const [characters, total] = await Promise.all([
      prisma.characterScore.findMany({
        where,
        orderBy: [{ language: "asc" }, { character: "asc" }],
        take: limit,
        skip: offset,
      }),
      prisma.characterScore.count({ where }),
    ]);

    return NextResponse.json({
      characters,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Failed to fetch character scores:", error);
    return NextResponse.json(
      { error: "Failed to retrieve character scores" },
      { status: 500 }
    );
  }
}
