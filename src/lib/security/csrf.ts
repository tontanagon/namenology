// =============================================================================
// CSRF & SAME-ORIGIN VERIFICATION (OWASP COMPLIANCE)
// Validates Origin / Host headers on state-changing requests to mitigate CSRF attacks
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const MUTATING_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

/**
 * Validates that mutating requests originate from the same application origin.
 * Webhooks with cryptographic signatures (e.g. Stripe) are exempted.
 */
export function verifyCsrfOrigin(req: NextRequest): { isValid: boolean; errorResponse?: NextResponse } {
  // Safe idempotent HTTP methods do not require origin check
  if (!MUTATING_METHODS.has(req.method.toUpperCase())) {
    return { isValid: true };
  }

  // Exempt Stripe webhook endpoint which enforces cryptographic HMAC signature verification
  if (req.nextUrl.pathname.startsWith("/api/stripe/webhook")) {
    return { isValid: true };
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host") || req.headers.get("x-forwarded-host");

  if (!origin || !host) {
    // In dev environment with direct API testing, allow if neither is set
    if (process.env.NODE_ENV !== "production") {
      return { isValid: true };
    }

    logger.security("CSRF", "Rejected request with missing origin or host headers", {
      pathname: req.nextUrl.pathname,
      method: req.method,
    });

    return {
      isValid: false,
      errorResponse: NextResponse.json(
        { error: "Forbidden: Origin validation failed.", code: "CSRF_DETECTED" },
        { status: 403 }
      ),
    };
  }

  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.host;

    if (originHost !== host) {
      logger.security("CSRF", "Cross-origin request blocked", {
        originHost,
        expectedHost: host,
        pathname: req.nextUrl.pathname,
      });

      return {
        isValid: false,
        errorResponse: NextResponse.json(
          { error: "Forbidden: Cross-origin request prohibited.", code: "CSRF_DETECTED" },
          { status: 403 }
        ),
      };
    }
  } catch {
    return {
      isValid: false,
      errorResponse: NextResponse.json(
        { error: "Forbidden: Malformed origin header.", code: "CSRF_DETECTED" },
        { status: 403 }
      ),
    };
  }

  return { isValid: true };
}
