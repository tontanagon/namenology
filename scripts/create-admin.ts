// =============================================================================
// ADMIN USER CREATION SCRIPT
// Usage: npm run db:create-admin [email] [password] [name]
// Or set environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
// =============================================================================

import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL || "admin@namenology.com";
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || "AdminSecret2026!";
  const name = process.argv[4] || process.env.ADMIN_NAME || "System Administrator";

  console.log(`🔐 Creating/Updating Admin User: ${email}...`);

  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      role: Role.ADMIN,
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      name,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Admin user successfully created/updated:`);
  console.log(`   ID:    ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name:  ${admin.name}`);
  console.log(`   Role:  ${admin.role}`);
}

createAdmin()
  .catch((e) => {
    console.error("❌ Failed to create admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
