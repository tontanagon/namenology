// =============================================================================
// NAMENOLOGY SEED SCRIPT
// Populates essential configuration-driven data for local development & testing:
// - Name Components with dynamic weights (First Name 60%, Surname 40%)
// - Analysis Config v1.0 (Free limits: 2 First Name, 2 Surname, 0 Combined)
// - Character Score Tables for Unicode Thai (ก-ฮ, vowels, tones) & English (A-Z)
// - Score Interpretations across 5 auspiciousness tiers (1-20, 21-40, 41-60, 61-80, 81-100)
// - Product Catalog & Entitlements (REQ-B01 to B12, B30, B31)
// =============================================================================

import {
  PrismaClient,
  CreditType,
  Language,
  ProductType,
  MissingFieldPolicy,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Namenology database seed...");

  // ---------------------------------------------------------------------------
  // 1. Name Components & Weights
  // ---------------------------------------------------------------------------
  console.log("--> Seeding Name Components...");
  const components = [
    {
      key: "FIRST_NAME",
      label: "First Name",
      description: "Primary personal given name score calculation",
      isRequired: true,
      isEnabled: true,
      weight: 60.0,
      sortOrder: 1,
    },
    {
      key: "SURNAME",
      label: "Surname",
      description: "Family / ancestral name score calculation",
      isRequired: true,
      isEnabled: true,
      weight: 40.0,
      sortOrder: 2,
    },
    {
      key: "MIDDLE_NAME",
      label: "Middle Name",
      description: "Optional secondary name component",
      isRequired: false,
      isEnabled: false,
      weight: 0.0,
      sortOrder: 3,
    },
    {
      key: "NICKNAME",
      label: "Nickname",
      description: "Informal or daily call name component",
      isRequired: false,
      isEnabled: false,
      weight: 0.0,
      sortOrder: 4,
    },
  ];

  for (const comp of components) {
    await prisma.nameComponent.upsert({
      where: { key: comp.key },
      update: comp,
      create: comp,
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Active Analysis Configuration (v1.0)
  // ---------------------------------------------------------------------------
  console.log("--> Seeding Analysis Configuration v1.0...");
  await prisma.analysisConfig.upsert({
    where: { version: "1.0" },
    update: {
      freeFirstNameLimit: 2,
      freeSurnameLimit: 2,
      freeCombinedLimit: 0,
      scorePrecision: 2,
      missingFieldPolicy: MissingFieldPolicy.REDISTRIBUTE_WEIGHT,
      minInputLength: 1,
      maxInputLength: 100,
      isActive: true,
    },
    create: {
      version: "1.0",
      freeFirstNameLimit: 2,
      freeSurnameLimit: 2,
      freeCombinedLimit: 0,
      scorePrecision: 2,
      missingFieldPolicy: MissingFieldPolicy.REDISTRIBUTE_WEIGHT,
      minInputLength: 1,
      maxInputLength: 100,
      isActive: true,
    },
  });

  // ---------------------------------------------------------------------------
  // 3. Character Scores (Thai & English)
  // ---------------------------------------------------------------------------
  console.log("--> Seeding Character Scores...");

  // English Chaldean numerology mapping (A-Z) from ref/score_text.txt
  const englishScores: Record<string, number> = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8,
  };

  for (const [char, score] of Object.entries(englishScores)) {
    await prisma.characterScore.upsert({
      where: {
        character_language: {
          character: char,
          language: Language.EN,
        },
      },
      update: { score, isActive: true },
      create: {
        character: char,
        language: Language.EN,
        score,
        isActive: true,
      },
    });
  }

  // Thai traditional numerology mapping (consonants, vowels, tone marks)
  const thaiScores: Record<string, number> = {
    // ก-ฮ Consonants
    "ก": 1, "ข": 2, "ฃ": 2, "ค": 3, "ฅ": 3, "ฆ": 4, "ง": 5,
    "จ": 6, "ฉ": 7, "ช": 8, "ซ": 9, "ฌ": 1, "ญ": 2, "ฎ": 3,
    "ฏ": 4, "ฐ": 5, "ฑ": 6, "ฒ": 7, "ณ": 8, "ด": 9, "ต": 1,
    "ถ": 2, "ท": 3, "ธ": 4, "น": 5, "บ": 6, "ป": 7, "ผ": 8,
    "ฝ": 9, "พ": 1, "ฟ": 2, "ภ": 3, "ม": 4, "ย": 5, "ร": 6,
    "ล": 7, "ว": 8, "ศ": 9, "ษ": 1, "ส": 2, "ห": 3, "ฬ": 4,
    "อ": 5, "ฮ": 6,
    // Vowels & Diacritics
    "ะ": 1, "า": 1, "ำ": 3, "ิ": 4, "ี": 5, "ึ": 6, "ื": 7,
    "ุ": 8, "ู": 9, "เ": 1, "แ": 2, "โ": 3, "ใ": 4, "ไ": 5,
    "ฤ": 6, "ฦ": 7, "ๅ": 1,
    // Tone marks & symbols
    "่": 1, "้": 2, "๊": 3, "๋": 4, "็": 5, "์": 6, "ๆ": 8, "ฯ": 7, "ฺ": 9,
  };

  for (const [char, score] of Object.entries(thaiScores)) {
    await prisma.characterScore.upsert({
      where: {
        character_language: {
          character: char,
          language: Language.TH,
        },
      },
      update: { score, isActive: true },
      create: {
        character: char,
        language: Language.TH,
        score,
        isActive: true,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Numerology Meanings & Score Interpretations (1 - 100)
  // ---------------------------------------------------------------------------
  console.log("--> Seeding Numerology Meanings (1-100)...");
  const { NUMEROLOGY_MEANINGS_1_TO_100 } = await import(
    "../src/lib/data/numerology-meanings"
  );

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

    const recommendation = item.beWaryOf
      ? `${item.beWaryOf}${item.illnesses ? ` Illnesses: ${item.illnesses}` : ""}`
      : item.illnesses || null;

    const interpData = {
      scoreMin: item.number,
      scoreMax: item.number,
      title: item.title,
      category: item.category,
      description: item.lifeDescription || item.groupCharacteristics,
      recommendation,
      language: "en",
      isActive: true,
    };

    const existingInterp = await prisma.scoreInterpretation.findFirst({
      where: {
        scoreMin: item.number,
        scoreMax: item.number,
        language: "en",
      },
    });

    if (existingInterp) {
      await prisma.scoreInterpretation.update({
        where: { id: existingInterp.id },
        data: interpData,
      });
    } else {
      await prisma.scoreInterpretation.create({
        data: interpData,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 5. Product Catalog & Entitlements (REQ-B01 to B12, B30, B31)
  // ---------------------------------------------------------------------------
  console.log("--> Seeding Product Catalog & Entitlements...");

  interface ProductSeed {
    code: string;
    name: string;
    description: string;
    productType: ProductType;
    price: number;
    currency: string;
    sortOrder: number;
    entitlements?: { creditType: CreditType; quantity: number }[];
  }

  const products: ProductSeed[] = [
    {
      code: "FREE_TIER",
      name: "Free Starter Allowance",
      description: "Complimentary initial quota: 2 First Name and 2 Surname individual analyses (0 Combined).",
      productType: ProductType.ANALYSIS_PACKAGE,
      price: 0.0,
      currency: "USD",
      sortOrder: 1,
      entitlements: [
        { creditType: CreditType.FIRST_NAME, quantity: 2 },
        { creditType: CreditType.SURNAME, quantity: 2 },
        { creditType: CreditType.COMBINED, quantity: 0 },
      ],
    },
    {
      code: "PKG_1_SET",
      name: "1 Complete Analysis Set",
      description: "Full complete set: 1 First Name + 1 Surname + 1 Combined synergy result.",
      productType: ProductType.ANALYSIS_PACKAGE,
      price: 19.0,
      currency: "USD",
      sortOrder: 2,
      entitlements: [
        { creditType: CreditType.FIRST_NAME, quantity: 1 },
        { creditType: CreditType.SURNAME, quantity: 1 },
        { creditType: CreditType.COMBINED, quantity: 1 },
      ],
    },
    {
      code: "PKG_2_SETS",
      name: "2 Complete Analysis Sets",
      description: "Full complete sets: 2 First Names + 2 Surnames + 2 Combined synergy results.",
      productType: ProductType.ANALYSIS_PACKAGE,
      price: 24.0,
      currency: "USD",
      sortOrder: 3,
      entitlements: [
        { creditType: CreditType.FIRST_NAME, quantity: 2 },
        { creditType: CreditType.SURNAME, quantity: 2 },
        { creditType: CreditType.COMBINED, quantity: 2 },
      ],
    },
    {
      code: "PKG_3_SETS",
      name: "3 Complete Analysis Sets",
      description: "Full complete sets: 3 First Names + 3 Surnames + 3 Combined synergy results.",
      productType: ProductType.ANALYSIS_PACKAGE,
      price: 45.0,
      currency: "USD",
      sortOrder: 4,
      entitlements: [
        { creditType: CreditType.FIRST_NAME, quantity: 3 },
        { creditType: CreditType.SURNAME, quantity: 3 },
        { creditType: CreditType.COMBINED, quantity: 3 },
      ],
    },
    {
      code: "PKG_5_SETS",
      name: "5 Complete Analysis Sets",
      description: "Full complete sets: 5 First Names + 5 Surnames + 5 Combined synergy results.",
      productType: ProductType.ANALYSIS_PACKAGE,
      price: 65.0, // Seeded as $65 per ADR-007 and REQ-B09
      currency: "USD",
      sortOrder: 5,
      entitlements: [
        { creditType: CreditType.FIRST_NAME, quantity: 5 },
        { creditType: CreditType.SURNAME, quantity: 5 },
        { creditType: CreditType.COMBINED, quantity: 5 },
      ],
    },
    {
      code: "SRV_BABY_NAMING",
      name: "Baby Naming Professional Service",
      description: "Comprehensive baby naming consultation and tailored auspicious names crafted by master specialists.",
      productType: ProductType.SERVICE,
      price: 150.0,
      currency: "USD",
      sortOrder: 6,
    },
    {
      code: "SRV_NAME_CHANGE",
      name: "Name Change Consultation Service",
      description: "Personalized astrological and numerological name restructuring for career, health, and prosperity.",
      productType: ProductType.SERVICE,
      price: 190.0,
      currency: "USD",
      sortOrder: 7,
    },
    {
      code: "SRV_SURNAME_CREATION",
      name: "Auspicious Surname Creation",
      description: "Exclusive family lineage surname creation ensuring generational prestige and phonetic harmony.",
      productType: ProductType.SERVICE,
      price: 360.0,
      currency: "USD",
      sortOrder: 8,
    },
  ];

  for (const prod of products) {
    const { entitlements, ...prodData } = prod;
    const upsertedProduct = await prisma.product.upsert({
      where: { code: prodData.code },
      update: prodData,
      create: prodData,
    });

    if (entitlements && entitlements.length > 0) {
      for (const ent of entitlements) {
        await prisma.productEntitlement.upsert({
          where: {
            productId_creditType: {
              productId: upsertedProduct.id,
              creditType: ent.creditType,
            },
          },
          update: { quantity: ent.quantity },
          create: {
            productId: upsertedProduct.id,
            creditType: ent.creditType,
            quantity: ent.quantity,
          },
        });
      }
    }
  }

  console.log("✅ Namenology database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
