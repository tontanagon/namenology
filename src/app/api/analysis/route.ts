// =============================================================================
// ANALYSIS API ROUTE — /api/analysis
// POST: Execute new analysis with entitlement check & atomic credit deduction
// GET: Retrieve paginated history of user's past analyses
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { analysisService, InsufficientCreditsError } from "@/services/analysis/analysis.service";
import { enforceRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import { sanitizeString } from "@/lib/security/sanitize";
import { logger } from "@/lib/logger";
import { CreditType } from "@prisma/client";

export const dynamic = "force-dynamic";

const analysisSchema = z.object({
  analysisType: z.nativeEnum(CreditType),
  firstName: z.string().max(100).optional(),
  surname: z.string().max(100).optional(),
  languagePreference: z.string().max(10).optional().default("en"),
});

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to perform name analysis." },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email address to access analysis features.",
          code: "EMAIL_VERIFICATION_REQUIRED",
        },
        { status: 403 }
      );
    }

    // Rate limiting per user ID
    const rateLimit = await enforceRateLimit(req, {
      preset: "ANALYSIS",
      identifier: user.id,
      routePrefix: "/api/analysis",
    });

    if (!rateLimit.isAllowed) {
      logger.security("ANALYSIS", "Analysis rate limit exceeded", { userId: user.id });
      return createRateLimitResponse(
        rateLimit,
        "Too many analysis requests. Please wait a moment before trying again."
      );
    }

    const body = await req.json();
    const validated = analysisSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Invalid analysis request parameters.",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { analysisType, firstName, surname, languagePreference } = validated.data;
    const sanitizedFirstName = firstName ? sanitizeString(firstName) : undefined;
    const sanitizedSurname = surname ? sanitizeString(surname) : undefined;

    const result = await analysisService.executeAnalysis({
      userId: user.id,
      analysisType,
      firstName: sanitizedFirstName,
      surname: sanitizedSurname,
      languagePreference,
    });

    logger.info("ANALYSIS", "Analysis executed successfully", {
      userId: user.id,
      analysisId: result.id,
      analysisType,
      score: result.score,
    });

    return NextResponse.json({
      success: true,
      analysis: result,
    });
  } catch (error: unknown) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "INSUFFICIENT_CREDITS",
          creditType: error.creditType,
          availableCredits: error.available,
          paywallRequired: true,
        },
        { status: 403 }
      );
    }

    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    logger.error("ANALYSIS", "Analysis execution failed", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email address to access analysis history.",
          code: "EMAIL_VERIFICATION_REQUIRED",
        },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const pageParam = searchParams.get("page");
    const offsetParam = searchParams.get("offset");
    const offset = offsetParam !== null
      ? Math.max(0, parseInt(offsetParam, 10))
      : pageParam !== null
      ? Math.max(0, (parseInt(pageParam, 10) - 1) * limit)
      : 0;

    const typeParam = searchParams.get("type") as CreditType | null;

    const history = await analysisService.getUserHistory(user.id, {
      limit,
      offset,
      type: typeParam && Object.values(CreditType).includes(typeParam) ? typeParam : undefined,
    });

    return NextResponse.json({
      success: true,
      items: history.items,
      analyses: history.items,
      total: history.total,
      limit: history.limit,
      offset: history.offset,
    });
  } catch (error) {
    logger.error("ANALYSIS", "List analyses failed", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
