// =============================================================================
// SERVER-SIDE SESSION MANAGEMENT
// Database-backed sessions with 30-day lifetime & secure HttpOnly cookies
// =============================================================================

import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { User, Session } from "@prisma/client";

export const SESSION_COOKIE_NAME = "namenology_session";
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  emailVerified: Date | null;
  stripeCustomerId: string | null;
  createdAt: Date;
}

export interface SessionValidationResult {
  session: Session | null;
  user: AuthenticatedUser | null;
}

/**
 * Generates a cryptographically secure 64-character random session token.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Creates a new session record in the database and returns the session object.
 */
export async function createSession(
  userId: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<{ session: Session; token: string }> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken: token,
      expiresAt,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    },
  });

  return { session, token };
}

/**
 * Sets the secure session cookie on the outgoing response.
 */
export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Clears the session cookie from the browser.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

/**
 * Validates a session token string against the database.
 * Deletes the session if it is expired.
 */
export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  if (!token) {
    return { session: null, user: null };
  }

  const sessionWithUser = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          emailVerified: true,
          stripeCustomerId: true,
          createdAt: true,
        },
      },
    },
  });

  if (!sessionWithUser) {
    return { session: null, user: null };
  }

  // Check if session has expired
  if (Date.now() >= sessionWithUser.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionWithUser.id } }).catch(() => {});
    return { session: null, user: null };
  }

  // Check if user is inactive / deactivated
  if (!sessionWithUser.user.isActive) {
    return { session: null, user: null };
  }

  const { user, ...session } = sessionWithUser;
  return { session, user };
}

/**
 * Retrieves and validates the current session from incoming request cookies.
 */
export async function getCurrentSession(): Promise<SessionValidationResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return { session: null, user: null };
  }
  return validateSessionToken(token);
}

/**
 * Invalidates a session by deleting it from the database and removing the cookie.
 */
export async function destroySession(token?: string): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = token || cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    await prisma.session.deleteMany({
      where: { sessionToken },
    }).catch(() => {});
  }

  await clearSessionCookie();
}
