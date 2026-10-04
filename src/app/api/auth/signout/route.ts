// =============================================================================
// SIGNOUT ROUTE HANDLER — POST /api/auth/signout
// Invalidates server session and clears HttpOnly session cookie
// =============================================================================

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  try {
    await destroySession();
    const response = NextResponse.json({
      success: true,
      message: "Successfully signed out",
    });
    response.cookies.delete("namenology_free_trials");
    return response;
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { error: "Failed to sign out cleanly." },
      { status: 500 }
    );
  }
}
