// =============================================================================
// ANALYSIS PREVIEW API ROUTE — POST /api/analysis/preview
// Calculates real-time numerology and phonetic values for Official First Name + Official Surname
// Enforces 2 free trial analyses limit across authenticated accounts & guest sessions.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { TextNormalizer } from "@/services/analysis/text-normalizer";
import { CharacterMapper } from "@/services/analysis/character-mapper";
import { getNumerologyGroup, reduceToRootNumber } from "@/lib/data/numerology-groups";
import { sanitizeString } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

const previewSchema = z.object({
  firstName: z.string().min(1, "Official First Name is required").max(100),
  surname: z.string().min(1, "Official Surname is required").max(100),
});

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    // 1. Quota Enforcement: Check if user has exceeded 2 free trial analyses
    const cookieTrials = parseInt(req.cookies.get("namenology_free_trials")?.value || "0", 10);

    if (user) {
      // For authenticated user: Check completed analyses count and credit ledger
      const analysesCount = await prisma.analysis.count({
        where: { userId: user.id },
      });

      const effectiveFreeUsed = Math.max(analysesCount, cookieTrials);

      const ledgerAggregates = await prisma.creditLedger.groupBy({
        by: ["creditType"],
        where: { userId: user.id },
        _sum: { amount: true },
      });

      const balances: Record<string, number> = {};
      for (const entry of ledgerAggregates) {
        balances[entry.creditType] = entry._sum.amount ?? 0;
      }
      const fnBal = Math.max(0, balances["FIRST_NAME"] || 0);
      const snBal = Math.max(0, balances["SURNAME"] || 0);
      const cbBal = Math.max(0, balances["COMBINED"] || 0);
      const totalCredits = cbBal + Math.min(fnBal, snBal);

      if (effectiveFreeUsed >= 2 && totalCredits <= 0) {
        return NextResponse.json(
          {
            error:
              "You have used your 2 free trial analyses. Subsequent analyses require credits. Please purchase a package to continue.",
            code: "INSUFFICIENT_CREDITS",
            freeQuotaExceeded: true,
            analysesCount: effectiveFreeUsed,
            totalCredits: 0,
          },
          { status: 403 }
        );
      }
    } else {
      // For guest session: Track free trials via cookie
      if (cookieTrials >= 2) {
        return NextResponse.json(
          {
            error:
              "You have used your 2 free trial analyses. Subsequent analyses require credits. Please sign up or purchase a package to continue.",
            code: "INSUFFICIENT_CREDITS",
            freeQuotaExceeded: true,
            analysesCount: cookieTrials,
            totalCredits: 0,
          },
          { status: 403 }
        );
      }
    }

    // 2. Validate input parameters
    const body = await req.json();
    const validated = previewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Both Official First Name and Official Surname are required for complete analysis.",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const sanitizedFirstName = sanitizeString(validated.data.firstName.trim());
    const sanitizedSurname = sanitizeString(validated.data.surname.trim());

    // 3. Process Official First Name
    const normFirst = TextNormalizer.normalize(sanitizedFirstName);
    const mapFirst = await CharacterMapper.mapCharacters(
      normFirst.characters,
      normFirst.detectedLanguage
    );

    // 4. Process Official Surname
    const normSurname = TextNormalizer.normalize(sanitizedSurname);
    const mapSurname = await CharacterMapper.mapCharacters(
      normSurname.characters,
      normSurname.detectedLanguage
    );

    if (mapFirst.unsupportedCharacters.length > 0) {
      return NextResponse.json(
        {
          error: `Unsupported character(s) in Official First Name: "${mapFirst.unsupportedCharacters.join(", ")}"`,
        },
        { status: 400 }
      );
    }

    if (mapSurname.unsupportedCharacters.length > 0) {
      return NextResponse.json(
        {
          error: `Unsupported character(s) in Official Surname: "${mapSurname.unsupportedCharacters.join(", ")}"`,
        },
        { status: 400 }
      );
    }

    // 5. Compute Character sums
    const firstCharSum = mapFirst.totalScore;
    const surnameCharSum = mapSurname.totalScore;
    const totalCompoundSum = firstCharSum + surnameCharSum;

    // 6. Derive Articles for all 3 components from our 1-100 knowledge base
    const firstNameArticle = getNumerologyGroup(firstCharSum);
    const surnameArticle = getNumerologyGroup(surnameCharSum);
    const fullNameArticle = getNumerologyGroup(totalCompoundSum);

    // 7. Compute harmonic scores (1 - 100)
    const maxFirstScore = normFirst.detectedLanguage === "TH" ? 9 : 8;
    const firstNameScore =
      mapFirst.mappedCharacters.length > 0
        ? (mapFirst.averageScore / maxFirstScore) * 100
        : 50;

    const maxSurnameScore = normSurname.detectedLanguage === "TH" ? 9 : 8;
    const surnameScore =
      mapSurname.mappedCharacters.length > 0
        ? (mapSurname.averageScore / maxSurnameScore) * 100
        : 50;

    const allChars = [...mapFirst.mappedCharacters, ...mapSurname.mappedCharacters];
    const fullNameAvg = allChars.reduce((s, c) => s + c.score, 0) / allChars.length;
    const maxFullScore =
      normFirst.detectedLanguage === "TH" || normSurname.detectedLanguage === "TH"
        ? 9
        : 8;
    const fullNameScore = (fullNameAvg / maxFullScore) * 100;

    // Tripartite weighted final score: 40% Official First Name + 20% Official Surname + 40% Full Name = 100%
    const finalScore =
      firstNameScore * 0.40 + surnameScore * 0.20 + fullNameScore * 0.40;

    const response = NextResponse.json({
      success: true,
      data: {
        firstName: {
          inputText: sanitizedFirstName,
          score: Math.round(firstNameScore * 100) / 100,
          charSum: firstCharSum,
          rootNumber: reduceToRootNumber(firstCharSum),
          characters: mapFirst.mappedCharacters,
          weight: 40, // 40% life influence
          article: firstNameArticle,
        },
        surname: {
          inputText: sanitizedSurname,
          score: Math.round(surnameScore * 100) / 100,
          charSum: surnameCharSum,
          rootNumber: reduceToRootNumber(surnameCharSum),
          characters: mapSurname.mappedCharacters,
          weight: 20, // 20% life influence
          article: surnameArticle,
        },
        fullName: {
          inputText: `${sanitizedFirstName} ${sanitizedSurname}`,
          finalScore: Math.round(finalScore * 100) / 100,
          fullNameScore: Math.round(fullNameScore * 100) / 100,
          totalCompoundSum, // Compound sum
          rootNumber: reduceToRootNumber(totalCompoundSum), // Root vibration
          weight: 40, // 40% life influence
          article: fullNameArticle, // Full name article
        },
      },
    });

    // Increment free trial cookie tracker
    response.cookies.set("namenology_free_trials", (cookieTrials + 1).toString(), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to calculate preview.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
