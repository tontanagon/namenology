// =============================================================================
// ANALYSIS PREVIEW API ROUTE — POST /api/analysis/preview
// Calculates real-time numerology and phonetic values for First Name + Surname
// without deducting credits. Delivers the preview and gated numerology article.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { TextNormalizer } from "@/services/analysis/text-normalizer";
import { CharacterMapper } from "@/services/analysis/character-mapper";
import { getNumerologyGroup, reduceToRootNumber } from "@/lib/data/numerology-groups";
import { sanitizeString } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

const previewSchema = z.object({
  firstName: z.string().min(1, "Given Name is required").max(100),
  surname: z.string().min(1, "Surname is required").max(100),
});

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    // Allow guest or authenticated preview
    const body = await req.json();
    const validated = previewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Both Given Name and Surname are required for complete analysis.",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const sanitizedFirstName = sanitizeString(validated.data.firstName.trim());
    const sanitizedSurname = sanitizeString(validated.data.surname.trim());

    // 1. Process First Name
    const normFirst = TextNormalizer.normalize(sanitizedFirstName);
    const mapFirst = await CharacterMapper.mapCharacters(
      normFirst.characters,
      normFirst.detectedLanguage
    );

    // 2. Process Surname
    const normSurname = TextNormalizer.normalize(sanitizedSurname);
    const mapSurname = await CharacterMapper.mapCharacters(
      normSurname.characters,
      normSurname.detectedLanguage
    );

    if (mapFirst.unsupportedCharacters.length > 0) {
      return NextResponse.json(
        {
          error: `Unsupported character(s) in Given Name: "${mapFirst.unsupportedCharacters.join(", ")}"`,
        },
        { status: 400 }
      );
    }

    if (mapSurname.unsupportedCharacters.length > 0) {
      return NextResponse.json(
        {
          error: `Unsupported character(s) in Surname: "${mapSurname.unsupportedCharacters.join(", ")}"`,
        },
        { status: 400 }
      );
    }

    // 3. Compute Character sums
    const firstCharSum = mapFirst.totalScore;
    const surnameCharSum = mapSurname.totalScore;
    const totalCompoundSum = firstCharSum + surnameCharSum;

    // 4. Derive Root Number & Numerology Article (1 - 100)
    const rootNumber = reduceToRootNumber(totalCompoundSum);
    const numerologyGroup = getNumerologyGroup(totalCompoundSum);

    // 5. Compute harmonic scores (1 - 100)
    const firstNameScore =
      mapFirst.mappedCharacters.length > 0
        ? (mapFirst.averageScore / 9) * 100
        : 50;
    const surnameScore =
      mapSurname.mappedCharacters.length > 0
        ? (mapSurname.averageScore / 9) * 100
        : 50;
    const finalScore = firstNameScore * 0.6 + surnameScore * 0.4;

    return NextResponse.json({
      success: true,
      data: {
        firstName: {
          inputText: sanitizedFirstName,
          score: Math.round(firstNameScore * 100) / 100,
          charSum: firstCharSum,
          rootNumber: reduceToRootNumber(firstCharSum),
          characters: mapFirst.mappedCharacters,
          weight: 60,
        },
        surname: {
          inputText: sanitizedSurname,
          score: Math.round(surnameScore * 100) / 100,
          charSum: surnameCharSum,
          rootNumber: reduceToRootNumber(surnameCharSum),
          characters: mapSurname.mappedCharacters,
          weight: 40,
        },
        fullName: {
          inputText: `${sanitizedFirstName} ${sanitizedSurname}`,
          finalScore: Math.round(finalScore * 100) / 100,
          totalCompoundSum, // 1. เลขรวม
          rootNumber,       // 1. เลขรวม (Root)
          article: numerologyGroup, // 2. ชื่อของบทความ + 3. ความหมายหรือบทความ
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to calculate preview.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
