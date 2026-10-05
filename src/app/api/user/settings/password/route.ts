// =============================================================================
// USER PASSWORD UPDATE API — POST /api/user/settings/password
// Validates current password and updates password using Argon2id
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { notificationService } from "@/services/notification.service";

import { emailService } from "@/services/email.service";

export const dynamic = "force-dynamic";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(100),
});

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = passwordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validated.data;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, dbUser.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Incorrect current password. Please verify and try again." },
        { status: 400 }
      );
    }

    // Hash new password with Argon2id
    const newPasswordHash = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

      // Revoke all other active sessions for security
      const sessionResult = await getCurrentSession();
      if (sessionResult.session) {
        await tx.session.deleteMany({
          where: {
            userId: user.id,
            NOT: { id: sessionResult.session.id },
          },
        });
      }
    });

    // Send security email alert
    emailService.sendPasswordChangedEmail(user.email, user.name).catch((err) => {
      console.warn("Failed to send password changed email:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. Other active sessions have been signed out.",
    });
  } catch (error) {
    console.error("Failed to update password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
