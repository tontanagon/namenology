// =============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC) & SERVER-SIDE GUARDS
// Enforces authentication and authorization in Server Components, Actions & Route Handlers
// =============================================================================

import { redirect } from "next/navigation";
import { getCurrentSession, AuthenticatedUser } from "./session";

export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message = "Insufficient permissions") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Returns the currently authenticated user, or null if not logged in.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const { user } = await getCurrentSession();
  return user;
}

/**
 * Ensures a request is authenticated.
 * If redirectUrl is provided and user is unauthenticated, redirects.
 * Otherwise, throws an AuthenticationError.
 */
export async function requireAuth(redirectUrl?: string): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    if (redirectUrl) {
      redirect(`/signin?callbackUrl=${encodeURIComponent(redirectUrl)}`);
    }
    throw new AuthenticationError("User must be authenticated to access this resource");
  }
  return user;
}

/**
 * Ensures a request is authenticated and has the ADMIN role.
 * Throws an AuthorizationError or redirects if unauthorized.
 */
export async function requireAdmin(redirectUrl?: string): Promise<AuthenticatedUser> {
  const user = await requireAuth(redirectUrl);
  if (user.role !== "ADMIN") {
    throw new AuthorizationError("Administrator access is required for this action");
  }
  return user;
}
