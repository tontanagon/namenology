// =============================================================================
// PRISMA CLIENT SINGLETON
// Ensures a single shared database connection pool in development & production
// Supports hot-reloading new schema models in active development
// =============================================================================

import { PrismaClient } from "@prisma/client";

function getPrisma(): PrismaClient {
  const globalAny = globalThis as any;
  let cached = globalAny.__namenology_prisma;

  if (cached && typeof cached.emailVerificationToken !== "undefined") {
    return cached;
  }

  // If in dev and emailVerificationToken is missing from cached instance,
  // bypass Next.js webpack cache using runtime require
  if (process.env.NODE_ENV !== "production") {
    try {
      const runtimeRequire = eval("require");
      Object.keys(runtimeRequire.cache).forEach((key) => {
        if (key.includes(".prisma") || key.includes("@prisma")) {
          delete runtimeRequire.cache[key];
        }
      });
      const { PrismaClient: FreshClient } = runtimeRequire("@prisma/client");
      cached = new FreshClient({
        log: ["error", "warn"],
      });
      globalAny.__namenology_prisma = cached;
      return cached;
    } catch (err) {
      console.warn("Dynamic Prisma refresh fallback:", err);
    }
  }

  if (cached) {
    return cached;
  }

  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalAny.__namenology_prisma = client;
  }
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
