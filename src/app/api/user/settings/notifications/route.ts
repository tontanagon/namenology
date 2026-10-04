// =============================================================================
// USER NOTIFICATION SETTINGS API — PATCH /api/user/settings/notifications
// Updates notification preferences & master toggle
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const notificationSchema = z.object({
  receiveNotifications: z.boolean(),
  notifyEmail: z.boolean().optional(),
  notifyMarketing: z.boolean().optional(),
  notifySecurity: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = notificationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { receiveNotifications, notifyEmail, notifyMarketing, notifySecurity } = validated.data;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        receiveNotifications,
        ...(notifyEmail !== undefined && { notifyEmail }),
        ...(notifyMarketing !== undefined && { notifyMarketing }),
        ...(notifySecurity !== undefined && { notifySecurity }),
      },
      select: {
        id: true,
        receiveNotifications: true,
        notifyEmail: true,
        notifyMarketing: true,
        notifySecurity: true,
      },
    });

    return NextResponse.json({
      success: true,
      preferences: updatedUser,
      message: "Notification preferences updated successfully",
    });
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
