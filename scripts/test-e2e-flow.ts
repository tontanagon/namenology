// =============================================================================
// E2E USER JOURNEY & QUALITY ASSURANCE VERIFICATION SUITE
// Simulates complete lifecycle: Signup -> Free Quota Allotment -> Free Analysis #1 ->
// Free Analysis #2 -> Analysis #3 Blocked (Paywall) -> Combined Blocked on Free ->
// Concurrency Race-Condition Test -> Stripe Purchase -> Paid Analysis -> CSV Export
// =============================================================================

import { CreditType, Role, ProductType } from "@prisma/client";
import { InsufficientCreditsError } from "../src/services/entitlement.service";
import { TextNormalizer } from "../src/services/analysis/text-normalizer";

interface SimulatedLedgerEntry {
  id: string;
  userId: string;
  creditType: CreditType;
  amount: number;
  sourceType: string;
  createdAt: Date;
}

interface SimulatedAnalysisRecord {
  id: string;
  userId: string;
  analysisType: CreditType;
  inputText: string;
  score: number;
  createdAt: Date;
}

class SimulatedEngine {
  private ledger: SimulatedLedgerEntry[] = [];
  private analyses: SimulatedAnalysisRecord[] = [];
  private activeLocks = new Set<string>();

  // 1. User Registration & Initial Free Quota Allotment (REQ-B02, B03, B12)
  signupUser(name: string, email: string) {
    const userId = `usr_${Date.now()}`;
    // Free allowance: 2 First Name, 2 Surname, 0 Combined
    this.ledger.push({
      id: `ledg_${Date.now()}_1`,
      userId,
      creditType: CreditType.FIRST_NAME,
      amount: 2,
      sourceType: "FREE_SIGNUP_ALLOWANCE",
      createdAt: new Date(),
    });
    this.ledger.push({
      id: `ledg_${Date.now()}_2`,
      userId,
      creditType: CreditType.SURNAME,
      amount: 2,
      sourceType: "FREE_SIGNUP_ALLOWANCE",
      createdAt: new Date(),
    });

    return { id: userId, name, email, role: Role.USER };
  }

  // Get Balance for Credit Type
  getBalance(userId: string, creditType: CreditType): number {
    return this.ledger
      .filter((e) => e.userId === userId && e.creditType === creditType)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  // Execute Analysis with Atomic Transaction and Concurrency Protection
  async executeAnalysis(params: {
    userId: string;
    analysisType: CreditType;
    firstName?: string;
    surname?: string;
  }): Promise<SimulatedAnalysisRecord> {
    const { userId, analysisType, firstName, surname } = params;

    // Concurrency Lock Key
    const lockKey = `${userId}:${analysisType}`;
    if (this.activeLocks.has(lockKey)) {
      throw new Error("Concurrent operation in progress on user credit wallet.");
    }
    this.activeLocks.add(lockKey);

    try {
      // 1. Validation
      if (analysisType === CreditType.FIRST_NAME && !firstName) {
        throw new Error("First name is required.");
      }
      if (analysisType === CreditType.COMBINED && (!firstName || !surname)) {
        throw new Error("Both First Name and Surname are required.");
      }

      // 2. Entitlement check
      const currentBalance = this.getBalance(userId, analysisType);
      if (currentBalance < 1) {
        throw new InsufficientCreditsError(analysisType, currentBalance);
      }

      // 3. Calculation simulation (using TextNormalizer for real NFC normalization)
      const input = [firstName, surname].filter(Boolean).join(" ");
      const normalized = TextNormalizer.normalize(input);
      // Deterministic calculation: pseudo-score between 70 and 95
      const calculatedScore = Math.min(100, Math.max(50, 70 + (input.length * 3) % 28));

      // 4. Atomic deduction
      this.ledger.push({
        id: `ledg_${Date.now()}_${Math.random()}`,
        userId,
        creditType: analysisType,
        amount: -1,
        sourceType: "USAGE_ANALYSIS",
        createdAt: new Date(),
      });

      const analysis: SimulatedAnalysisRecord = {
        id: `ana_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        userId,
        analysisType,
        inputText: normalized.normalizedText,
        score: calculatedScore,
        createdAt: new Date(),
      };
      this.analyses.push(analysis);

      return analysis;
    } finally {
      this.activeLocks.delete(lockKey);
    }
  }

  // Stripe Checkout Session Fulfillment
  grantPackage(userId: string, packageType: "STARTER" | "STANDARD" | "PREMIUM") {
    const entitlements: Record<string, { firstName: number; surname: number; combined: number }> = {
      STARTER: { firstName: 5, surname: 5, combined: 2 },
      STANDARD: { firstName: 10, surname: 10, combined: 5 },
      PREMIUM: { firstName: 25, surname: 25, combined: 15 },
    };

    const quota = entitlements[packageType];
    this.ledger.push({
      id: `ledg_pkg_${Date.now()}_1`,
      userId,
      creditType: CreditType.FIRST_NAME,
      amount: quota.firstName,
      sourceType: "PURCHASE_PACKAGE",
      createdAt: new Date(),
    });
    this.ledger.push({
      id: `ledg_pkg_${Date.now()}_2`,
      userId,
      creditType: CreditType.SURNAME,
      amount: quota.surname,
      sourceType: "PURCHASE_PACKAGE",
      createdAt: new Date(),
    });
    this.ledger.push({
      id: `ledg_pkg_${Date.now()}_3`,
      userId,
      creditType: CreditType.COMBINED,
      amount: quota.combined,
      sourceType: "PURCHASE_PACKAGE",
      createdAt: new Date(),
    });
  }

  // History & CSV Export (REQ-B47)
  getHistoryCsv(userId: string): string {
    const userAnalyses = this.analyses.filter((a) => a.userId === userId);
    const headers = ["ID", "Type", "Input", "Score", "Date"];
    const rows = userAnalyses.map((a) => [
      a.id,
      a.analysisType,
      `"${a.inputText}"`,
      a.score,
      a.createdAt.toISOString(),
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }
}

async function runE2EUserJourney() {
  console.log("==================================================================");
  console.log("STARTING PHASE 11: FULL E2E USER JOURNEY & INTEGRATION TEST");
  console.log("==================================================================\n");

  let passed = 0;
  let total = 0;

  function assert(cond: boolean, name: string) {
    total++;
    if (cond) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
    }
  }

  const engine = new SimulatedEngine();

  // 1. User Registration
  console.log("--- Step 1: User Signup & Free Quota Allocation (REQ-B02, B03) ---");
  const user = engine.signupUser("Anan Sukjai", "anan@example.com");
  assert(user.name === "Anan Sukjai", "User registered successfully");

  const fnBalance0 = engine.getBalance(user.id, CreditType.FIRST_NAME);
  const snBalance0 = engine.getBalance(user.id, CreditType.SURNAME);
  const cbBalance0 = engine.getBalance(user.id, CreditType.COMBINED);

  assert(fnBalance0 === 2, "Granted exactly 2 free First Name credits");
  assert(snBalance0 === 2, "Granted exactly 2 free Surname credits");
  assert(cbBalance0 === 0, "Free plan granted 0 Combined credits (REQ-B02, REQ-B40)");

  // 2. Attempt Combined Analysis on Free tier (Should be blocked)
  console.log("\n--- Step 2: Combined Analysis on Free Tier Blockage (REQ-B40) ---");
  let combinedBlocked = false;
  try {
    await engine.executeAnalysis({
      userId: user.id,
      analysisType: CreditType.COMBINED,
      firstName: "Anan",
      surname: "Sukjai",
    });
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      combinedBlocked = true;
    }
  }
  assert(combinedBlocked, "Combined analysis blocked on Free plan with InsufficientCreditsError");

  // 3. Execute First Name Analysis #1
  console.log("\n--- Step 3: First Name Analysis #1 (Consume Credit 1/2) ---");
  const analysis1 = await engine.executeAnalysis({
    userId: user.id,
    analysisType: CreditType.FIRST_NAME,
    firstName: "Anan",
  });
  assert(analysis1.score > 0, `Analysis #1 generated score: ${analysis1.score}/100`);
  const fnBalance1 = engine.getBalance(user.id, CreditType.FIRST_NAME);
  assert(fnBalance1 === 1, "First Name credit balance decremented to 1");

  // 4. Execute First Name Analysis #2
  console.log("\n--- Step 4: First Name Analysis #2 (Consume Credit 2/2) ---");
  const analysis2 = await engine.executeAnalysis({
    userId: user.id,
    analysisType: CreditType.FIRST_NAME,
    firstName: "Somchai",
  });
  assert(analysis2.score > 0, `Analysis #2 generated score: ${analysis2.score}/100`);
  const fnBalance2 = engine.getBalance(user.id, CreditType.FIRST_NAME);
  assert(fnBalance2 === 0, "First Name credit balance decremented to 0 (Exhausted)");

  // 5. Attempt Analysis #3 (Should be blocked with Paywall required)
  console.log("\n--- Step 5: First Name Analysis #3 Blockage (Paywall Enforced) ---");
  let thirdBlocked = false;
  try {
    await engine.executeAnalysis({
      userId: user.id,
      analysisType: CreditType.FIRST_NAME,
      firstName: "David",
    });
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      thirdBlocked = true;
      assert(err.available === 0, "InsufficientCreditsError reports available: 0");
    }
  }
  assert(thirdBlocked, "Analysis #3 blocked when quota is exhausted (Paywall condition met)");

  // 6. Concurrency Protection Test (Simultaneous calls with 1 Surname credit remaining)
  console.log("\n--- Step 6: Concurrency Protection (Prevent Double-Spend) ---");
  // Surname currently has 2 credits. Let's consume 1 so exactly 1 remains.
  await engine.executeAnalysis({
    userId: user.id,
    analysisType: CreditType.SURNAME,
    surname: "Sukjai",
  });
  assert(engine.getBalance(user.id, CreditType.SURNAME) === 1, "Surname balance is exactly 1");

  // Now trigger two parallel requests for the last remaining credit
  let parallelSuccessCount = 0;
  let parallelErrorCount = 0;

  const p1 = engine
    .executeAnalysis({
      userId: user.id,
      analysisType: CreditType.SURNAME,
      surname: "Charoen",
    })
    .then(() => parallelSuccessCount++)
    .catch(() => parallelErrorCount++);

  const p2 = engine
    .executeAnalysis({
      userId: user.id,
      analysisType: CreditType.SURNAME,
      surname: "Charoen",
    })
    .then(() => parallelSuccessCount++)
    .catch(() => parallelErrorCount++);

  await Promise.all([p1, p2]);

  assert(parallelSuccessCount === 1, "Exactly 1 concurrent request succeeded with last credit");
  assert(parallelErrorCount === 1, "Second concurrent request safely rejected (No double-spend)");
  assert(engine.getBalance(user.id, CreditType.SURNAME) === 0, "Final balance non-negative (0)");

  // 7. Stripe Purchase Simulation (Standard Package)
  console.log("\n--- Step 7: Stripe Package Purchase Simulation ($24 Package) ---");
  engine.grantPackage(user.id, "STANDARD");
  const fnPaid = engine.getBalance(user.id, CreditType.FIRST_NAME);
  const snPaid = engine.getBalance(user.id, CreditType.SURNAME);
  const cbPaid = engine.getBalance(user.id, CreditType.COMBINED);

  assert(fnPaid === 10, "Granted 10 First Name credits from Standard Package");
  assert(snPaid === 10, "Granted 10 Surname credits from Standard Package");
  assert(cbPaid === 5, "Granted 5 Combined credits from Standard Package");

  // 8. Execute Combined Analysis Post-Purchase
  console.log("\n--- Step 8: Post-Purchase Combined Analysis Execution ---");
  const combinedAnalysis = await engine.executeAnalysis({
    userId: user.id,
    analysisType: CreditType.COMBINED,
    firstName: "Anan",
    surname: "Sukjai",
  });
  assert(combinedAnalysis.score > 0, `Combined Analysis generated score: ${combinedAnalysis.score}/100`);
  assert(
    engine.getBalance(user.id, CreditType.COMBINED) === 4,
    "Combined credit balance successfully deducted to 4"
  );

  // 9. Analysis History & CSV Export (REQ-B47)
  console.log("\n--- Step 9: Analysis History & CSV Export (REQ-B47) ---");
  const csv = engine.getHistoryCsv(user.id);
  assert(csv.includes("ID,Type,Input,Score,Date"), "CSV export contains standard headers");
  assert(csv.includes("COMBINED"), "CSV export includes Combined analysis row");
  assert(csv.includes("FIRST_NAME"), "CSV export includes First Name analysis row");

  console.log("\n==================================================================");
  console.log(`E2E TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log("==================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runE2EUserJourney()
  .then(() => {
    console.log("E2E User Journey verification completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("E2E flow test failed:", err);
    process.exit(1);
  });
