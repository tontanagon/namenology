// =============================================================================
// NOTIFICATIONS API — GET /api/notifications & PATCH /api/notifications
// Retrieves user notifications & marks all as read
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { notificationService } from "@/services/notification.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "15", 10);

    const [notifications, unreadCount] = await Promise.all([
      notificationService.getUserNotifications(user.id, limit),
      notificationService.getUnreadCount(user.id),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await notificationService.markAllAsRead(user.id);

    return NextResponse.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
