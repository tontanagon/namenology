// =============================================================================
// SIGNOUT ROUTE HANDLER — POST /api/auth/signout
// Invalidates server session and clears HttpOnly session cookie
// =============================================================================

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({
      success: true,
      message: "Successfully signed out",
    });
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { error: "Failed to sign out cleanly." },
      { status: 500 }
    );
  }
}
