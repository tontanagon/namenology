// =============================================================================
// USER SETTINGS API — GET /api/user/settings
// Returns user profile info, preferences, and credit overview
// =============================================================================

import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { entitlementService } from "@/services/entitlement.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [dbUser, entitlements, analysisCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          receiveNotifications: true,
          notifyEmail: true,
          notifyMarketing: true,
          notifySecurity: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      entitlementService.getUserEntitlements(user.id),
      prisma.analysis.count({ where: { userId: user.id } }),
    ]);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: dbUser,
      entitlements,
      analysisCount,
    });
  } catch (error) {
    console.error("Failed to load user settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
