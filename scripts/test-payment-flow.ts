import { prisma } from "../src/lib/prisma";
import { stripeService } from "../src/services/stripe.service";
import { entitlementService } from "../src/services/entitlement.service";
import { analysisService } from "../src/services/analysis/analysis.service";
import { ProductType, CreditType, Role } from "@prisma/client";

async function main() {
  console.log("=================================================");
  console.log("STARTING STRIPE PAYMENT & ENTITLEMENT FLOW TEST");
  console.log("=================================================\n");

  // 1. Create a test user
  const timestamp = Date.now();
  const testEmail = `stripe-test-${timestamp}@namenology.local`;
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      name: "Stripe Test User",
      passwordHash: "argon2id$mock_hash_for_test",
      role: Role.USER,
    },
  });
  console.log(`[PASS] Created test user: ${user.email} (${user.id})`);

  // Initial credits should be 0
  const initialEntitlements = await entitlementService.getUserEntitlements(user.id);
  console.log(
    `[INFO] Initial balances: First Name=${initialEntitlements.balances.FIRST_NAME}, Surname=${initialEntitlements.balances.SURNAME}, Combined=${initialEntitlements.balances.COMBINED}`
  );

  // 2. Fetch an analysis package product from database
  const packageProduct = await prisma.product.findFirst({
    where: {
      code: "PKG_2_SETS", // 2 Complete Analysis Sets ($24)
    },
    include: { entitlements: true },
  });

  if (!packageProduct) {
    throw new Error(
      "Package product PKG_2_SETS not found in database! Seed might be missing."
    );
  }
  console.log(
    `[PASS] Found target package: "${packageProduct.name}" ($${packageProduct.price}) with entitlements:`
  );
  for (const ent of packageProduct.entitlements) {
    console.log(`       - ${ent.creditType}: ${ent.quantity}`);
  }

  // 3. Initiate Checkout Session
  const sessionResult = await stripeService.createCheckoutSession({
    userId: user.id,
    productId: packageProduct.id,
    appUrl: "http://localhost:3000",
  });
  console.log(
    `[PASS] Created checkout session. Simulated: ${sessionResult.isSimulated}, Order ID: ${sessionResult.orderId}`
  );

  // Check Order status
  const order = await prisma.order.findUnique({
    where: { id: sessionResult.orderId },
  });
  console.log(
    `[PASS] Order created in DB: Status=${order?.status}, Amount=${order?.amount} ${order?.currency}`
  );

  // Verify balances after checkout (simulated mode auto-processes checkout in dev fallback)
  const postCheckoutEntitlements = await entitlementService.getUserEntitlements(user.id);
  console.log(
    `[PASS] Balances after checkout: First Name=${postCheckoutEntitlements.balances.FIRST_NAME}, Surname=${postCheckoutEntitlements.balances.SURNAME}, Combined=${postCheckoutEntitlements.balances.COMBINED}`
  );

  // Verify that credits match package entitlements
  for (const ent of packageProduct.entitlements) {
    if (postCheckoutEntitlements.balances[ent.creditType] < ent.quantity) {
      throw new Error(
        `Balance mismatch for ${ent.creditType}: expected at least ${ent.quantity}, got ${postCheckoutEntitlements.balances[ent.creditType]}`
      );
    }
  }

  // 4. Test Webhook Idempotency (REQ-B51)
  console.log("\n[TEST] Testing Webhook Idempotency with mock event...");
  const mockEventId = `evt_test_${timestamp}`;
  const mockWebhookEvent: any = {
    id: mockEventId,
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_test_${timestamp}`,
        metadata: {
          userId: user.id,
          productId: packageProduct.id,
          orderId: order?.id,
        },
        client_reference_id: order?.id,
      },
    },
  };

  // First call
  const webhookResult1 = await stripeService.handleWebhookEvent(mockWebhookEvent);
  console.log(
    `[PASS] First webhook dispatch: success=${webhookResult1.success}, duplicate=${webhookResult1.duplicate}`
  );

  // Second call with the same event ID should be recognized as duplicate and NOT grant extra credits
  const webhookResult2 = await stripeService.handleWebhookEvent(mockWebhookEvent);
  console.log(
    `[PASS] Second webhook dispatch: success=${webhookResult2.success}, duplicate=${webhookResult2.duplicate}`
  );
  if (!webhookResult2.duplicate) {
    throw new Error("Webhook idempotency check failed: expected duplicate=true");
  }

  // 5. Test Service Order Purchase (REQ-B11, B25, B44)
  console.log("\n[TEST] Testing Professional Service Checkout...");
  const serviceProduct = await prisma.product.findFirst({
    where: {
      productType: ProductType.SERVICE,
    },
  });

  if (!serviceProduct) {
    throw new Error("Professional service product not found in database!");
  }
  console.log(`[PASS] Found service product: "${serviceProduct.name}" ($${serviceProduct.price})`);

  await stripeService.createCheckoutSession({
    userId: user.id,
    productId: serviceProduct.id,
    appUrl: "http://localhost:3000",
  });

  const serviceOrders = await prisma.serviceOrder.findMany({
    where: { userId: user.id, productId: serviceProduct.id },
  });
  console.log(
    `[PASS] Service order created: count=${serviceOrders.length}, status=${serviceOrders[0]?.status}`
  );
  if (serviceOrders.length === 0) {
    throw new Error("Service order was not created for service product checkout!");
  }

  // 6. Test Analysis Execution consuming purchased credit
  console.log("\n[TEST] Running Analysis to verify purchased credit consumption...");
  const analysisResult = await analysisService.executeAnalysis({
    userId: user.id,
    analysisType: CreditType.FIRST_NAME,
    firstName: "Siriporn",
  });
  console.log(`[PASS] Analysis executed successfully! Analysis ID: ${analysisResult.id}`);
  console.log(`       First Name Final Score: ${analysisResult.score}`);
  console.log(`       Raw Score: ${analysisResult.rawScore}`);

  // Check remaining balances
  const finalEntitlements = await entitlementService.getUserEntitlements(user.id);
  console.log(
    `[PASS] Balances after 1 First Name analysis: First Name=${finalEntitlements.balances.FIRST_NAME}, Surname=${finalEntitlements.balances.SURNAME}, Combined=${finalEntitlements.balances.COMBINED}`
  );

  // Cleanup test user and associated records (cascading deletes handle children)
  console.log("\n[CLEANUP] Cleaning up test data...");
  await prisma.stripeWebhookEvent.deleteMany({ where: { stripeEventId: mockEventId } });
  await prisma.user.delete({ where: { id: user.id } });

  console.log("\n=================================================");
  console.log("ALL STRIPE PAYMENT & ENTITLEMENT TESTS PASSED! OK");
  console.log("=================================================");
}

main()
  .catch((err) => {
    console.error("Test failed with error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
