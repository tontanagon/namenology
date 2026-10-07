// =============================================================================
// ADMIN EMAIL TEST API — POST /api/admin/email/test
// Allows administrators to verify SMTP deliverability and preview email templates
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { emailService } from "@/services/email.service";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

const adminEmailTestSchema = z.object({
  targetEmail: z.string().email("Invalid target email address"),
  templateType: z.enum(["TEST", "WELCOME", "SECURITY", "ANALYSIS"]).default("TEST"),
});

export async function GET() {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const host = process.env.SMTP_HOST || "Ethereal / Development Mock";
    const port = process.env.SMTP_PORT || "587";
    const from = process.env.EMAIL_FROM || '"NAMENOLOGY" <notifications@namenology.com>';
    const isConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

    return NextResponse.json({
      configured: isConfigured,
      host,
      port,
      from,
      mode: isConfigured ? "Production SMTP" : "Ethereal / Dev Sandbox",
    });
  } catch (error) {
    console.error("Failed to load email configuration status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const validated = adminEmailTestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { targetEmail, templateType } = validated.data;
    let result;

    switch (templateType) {
      case "WELCOME":
        result = await emailService.sendWelcomeEmail(targetEmail, "New Member");
        break;
      case "SECURITY":
        result = await emailService.sendPasswordChangedEmail(targetEmail, "System Administrator");
        break;
      case "ANALYSIS":
        result = await emailService.sendAnalysisReadyEmail(
          user.id,
          targetEmail,
          "Valued Client",
          "Alexander Sterling (Demo Name)",
          96,
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/analysis-history`
        );
        break;
      case "TEST":
      default:
        result = await emailService.sendTestEmail(targetEmail, "System Administrator");
        break;
    }

    if (!result || !result.success) {
      return NextResponse.json(
        { error: result?.error || "Failed to dispatch email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email (${templateType}) successfully sent to ${targetEmail}`,
      messageId: result.messageId,
      previewUrl: result.previewUrl || null,
    });
  } catch (error) {
    console.error("Admin test email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
