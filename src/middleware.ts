// =============================================================================
// NEXT.JS ROUTE PROTECTION & SECURITY MIDDLEWARE
// Server-side boundary enforcing authentication, CSRF validation & security headers
// =============================================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCsrfOrigin } from "@/lib/security/csrf";

const SESSION_COOKIE_NAME = "namenology_session";

// Routes that strictly require user authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/analyze",
  "/account",
  "/subscription",
  "/analysis-history",
  "/history",
  "/admin",
  "/services/orders",
];

// Routes accessible only when NOT signed in
const AUTH_PREFIXES = ["/signin", "/signup"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. API Route Defense: CSRF and origin validation for mutating endpoints
  if (pathname.startsWith("/api")) {
    const csrf = verifyCsrfOrigin(req);
    if (!csrf.isValid && csrf.errorResponse) {
      return csrf.errorResponse;
    }
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    return response;
  }

  // 2. Authentication verification for page routes
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(sessionCookie);

  // Redirect unauthenticated users from protected pages to /signin
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedPath && !isAuthenticated) {
    const signinUrl = new URL("/signin", req.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect authenticated users away from /signin and /signup to /dashboard
  const isAuthPath = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images and assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
