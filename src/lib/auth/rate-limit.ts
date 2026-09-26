// =============================================================================
// AUTH RATE LIMITER PROXY
// Re-exports enterprise rate limiting engine for backwards compatibility
// =============================================================================

export {
  checkRateLimit,
  getClientIp,
  enforceRateLimit,
  createRateLimitResponse,
  RATE_LIMIT_PRESETS,
} from "@/lib/security/rate-limiter";
export type {
  RateLimitConfig,
  RateLimitResult,
  RateLimitPreset,
} from "@/lib/security/rate-limiter";
