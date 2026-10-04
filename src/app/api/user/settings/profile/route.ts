// =============================================================================
// USER PROFILE UPDATE API — PATCH /api/user/settings/profile
// Allows updating user full name
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

export async function PATCH(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = profileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeString(validated.data.name);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: sanitizedName },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
