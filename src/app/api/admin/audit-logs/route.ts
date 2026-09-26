import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(10, Number(searchParams.get("limit") || "30")));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (action && action !== "ALL") {
      where.action = action;
    }

    const [logs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        include: {
          adminUser: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.adminAuditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Failed to load audit logs:", error);
    return NextResponse.json(
      { error: "Failed to retrieve audit logs." },
      { status: 500 }
    );
  }
}
