// =============================================================================
// PASSWORD HASHING UTILITY — ARGON2ID
// Strictly implements Argon2id security parameters specified in docs/AUTH.md
// =============================================================================

import { hash, verify } from "@node-rs/argon2";

const ARGON2_OPTIONS = {
  memoryCost: 65536, // 64 MB
  timeCost: 3,       // 3 iterations
  parallelism: 4,    // 4 threads
  outputLen: 32,     // 32 bytes hash length
};

/**
 * Hashes a plaintext password using Argon2id.
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

/**
 * Verifies a plaintext password against an Argon2id hash.
 */
export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  try {
    return await verify(passwordHash, password, ARGON2_OPTIONS);
  } catch {
    return false;
  }
}
