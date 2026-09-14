import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "iseyc_staff_session";
const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

export function passcodeRequired(): boolean {
  return Boolean(process.env.REGISTER_PASSCODE && process.env.REGISTER_PASSCODE.length > 0);
}

export function checkPasscode(submitted: string | undefined | null): boolean {
  const expected = process.env.REGISTER_PASSCODE;
  if (!expected) return true;
  if (!submitted) return false;
  return submitted === expected;
}

/** Simple signed token derived from passcode + day salt (not cryptographic SSO). */
export function issueSessionToken(): string {
  const expected = process.env.REGISTER_PASSCODE ?? "open";
  const day = new Date().toISOString().slice(0, 10);
  // Lightweight integrity marker — enough for field gate, not full auth platform
  const raw = `${expected}::${day}::iseyc-desk`;
  return Buffer.from(raw).toString("base64url");
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!passcodeRequired()) return true;
  if (!token) return false;
  try {
    const expected = issueSessionToken();
    return token === expected;
  } catch {
    return false;
  }
}

export function getSessionFromCookies(): boolean {
  try {
    const jar = cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

/** Accept either valid session cookie OR body.passcode (never query string). */
export function authorizeRequest(bodyPasscode?: string | null): boolean {
  if (!passcodeRequired()) return true;
  if (getSessionFromCookies()) return true;
  return checkPasscode(bodyPasscode);
}

export const STAFF_COOKIE = {
  name: COOKIE_NAME,
  maxAge: SESSION_MAX_AGE,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  },
};

// --- In-memory rate limit (per serverless isolate; good enough for field gate) ---
const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimitUnlock(ip: string, limit = 8, windowMs = 15 * 60 * 1000): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (entry.count >= limit) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true };
}
