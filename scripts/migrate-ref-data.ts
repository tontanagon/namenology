// =============================================================================
// DATABASE MIGRATION SCRIPT: REF DATA INGESTION
// Migrates:
// 1. Character Scores for English (A-Z) from ref/score_text.txt (Chaldean system)
// 2. Numerology Meanings (1 - 100) from ref/Numerology_Meanings_1-100_Edited.docx
// 3. Score Interpretations (1 - 100) for exact score mapping (1..100)
// =============================================================================

import { PrismaClient, Language } from "@prisma/client";
import { NUMEROLOGY_MEANINGS_1_TO_100 } from "../src/lib/data/numerology-meanings";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

function parseScoreText(filePath: string): Record<string, number> {
  const content = fs.readFileSync(filePath, "utf-8");
  const result: Record<string, number> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes("=")) continue;
    const [scorePart, lettersPart] = trimmed.split("=", 2);
    const scoreVal = parseInt(scorePart.trim(), 10);
    if (isNaN(scoreVal)) continue;

    const letters = lettersPart.trim().split(/\s+/);
    for (const l of letters) {
      const clean = l.trim().toUpperCase();
      if (clean) {
        result[clean] = scoreVal;
      }
    }
  }

  return result;
}

async function migrate() {
  console.log("🚀 Starting Ref Data Migration...\n");

  // ---------------------------------------------------------------------------
  // 1. Ingest & Migrate Character Scores from ref/score_text.txt
  // ---------------------------------------------------------------------------
  const scoreTextPath = path.resolve(process.cwd(), "ref", "score_text.txt");
  console.log(`[1/3] Reading character scores from: ${scoreTextPath}`);

  if (!fs.existsSync(scoreTextPath)) {
    throw new Error(`Ref file not found: ${scoreTextPath}`);
  }

  const chaldeanScores = parseScoreText(scoreTextPath);
  console.log(`Parsed ${Object.keys(chaldeanScores).length} English letter scores:`, chaldeanScores);

  let charUpdated = 0;
  for (const [char, score] of Object.entries(chaldeanScores)) {
    await prisma.characterScore.upsert({
      where: {
        character_language: {
          character: char,
          language: Language.EN,
        },
      },
      update: {
        score,
        isActive: true,
      },
      create: {
        character: char,
        language: Language.EN,
        score,
        isActive: true,
      },
    });
    charUpdated++;
  }
  console.log(`✅ Successfully migrated ${charUpdated} English character scores in database.\n`);

  // ---------------------------------------------------------------------------
  // 2. Ingest & Migrate Numerology Meanings 1 - 100
  // ---------------------------------------------------------------------------
  console.log(`[2/3] Migrating 100 Numerology Meanings from ref/Numerology_Meanings_1-100_Edited.docx...`);
  console.log(`Loaded ${NUMEROLOGY_MEANINGS_1_TO_100.length} parsed meanings from dataset.`);

  let meaningsUpdated = 0;
  for (const item of NUMEROLOGY_MEANINGS_1_TO_100) {
    await prisma.numerologyMeaning.upsert({
      where: { number: item.number },
      update: {
        rootNumber: item.rootNumber,
        groupNumber: item.groupNumber,
        title: item.title,
        category: item.category,
        meaningsAndSymbols: item.meaningsAndSymbols,
        groupCharacteristics: item.groupCharacteristics,
        lifeDescription: item.lifeDescription,
        shadowPolarity: item.shadowPolarity,
        beWaryOf: item.beWaryOf,
        illnesses: item.illnesses,
        loveAndFamily: item.loveAndFamily,
        exampleNames: item.exampleNames,
        language: "en",
        isActive: true,
      },
      create: {
        number: item.number,
        rootNumber: item.rootNumber,
        groupNumber: item.groupNumber,
        title: item.title,
        category: item.category,
        meaningsAndSymbols: item.meaningsAndSymbols,
        groupCharacteristics: item.groupCharacteristics,
        lifeDescription: item.lifeDescription,
        shadowPolarity: item.shadowPolarity,
        beWaryOf: item.beWaryOf,
        illnesses: item.illnesses,
        loveAndFamily: item.loveAndFamily,
        exampleNames: item.exampleNames,
        language: "en",
        isActive: true,
      },
    });
    meaningsUpdated++;
  }
  console.log(`✅ Successfully migrated ${meaningsUpdated} Numerology Meanings (1-100) in database.\n`);

  // ---------------------------------------------------------------------------
  // 3. Clean up legacy broad ranges and migrate Score Interpretations (1 - 100)
  // ---------------------------------------------------------------------------
  console.log(`[3/3] Migrating Score Interpretations for individual scores 1 - 100...`);

  // Deactivate or delete legacy wide ranges (where scoreMax - scoreMin > 0)
  const legacyRanges = await prisma.scoreInterpretation.deleteMany({
    where: {
      language: "en",
      NOT: {
        scoreMin: {
          equals: prisma.scoreInterpretation.fields.scoreMax,
        },
      },
    },
  });
  console.log(`Removed ${legacyRanges.count} legacy multi-point score ranges.`);

  let interpsUpdated = 0;
  for (const item of NUMEROLOGY_MEANINGS_1_TO_100) {
    const existing = await prisma.scoreInterpretation.findFirst({
      where: {
        scoreMin: item.number,
        scoreMax: item.number,
        language: "en",
      },
    });

    const recommendation = item.beWaryOf
      ? `${item.beWaryOf}${item.illnesses ? ` Illnesses: ${item.illnesses}` : ""}`
      : item.illnesses || null;

    const data = {
      scoreMin: item.number,
      scoreMax: item.number,
      title: item.title,
      category: item.category,
      description: item.lifeDescription || item.groupCharacteristics,
      recommendation,
      language: "en",
      isActive: true,
    };

    if (existing) {
      await prisma.scoreInterpretation.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.scoreInterpretation.create({
        data,
      });
    }
    interpsUpdated++;
  }
  console.log(`✅ Successfully migrated ${interpsUpdated} Score Interpretations (1-100) in database.\n`);

  console.log("🎉 Migration complete! All ref data has been successfully synchronized.");
}

migrate()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
