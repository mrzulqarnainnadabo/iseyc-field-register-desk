import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const STAFF_COOKIE_NAME = "gtg_staff_session";
const SESSION_SECONDS = 8 * 60 * 60;
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_TRACKED_RATE_LIMIT_KEYS = 5000;

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function sign(payload: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Staff session secret is not configured securely");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/**
 * Process-local abuse throttling. This bounds memory use, but is not a
 * distributed rate limiter and must not be treated as one across instances.
 */
export function isRateLimitedAttempt(
  store: Map<string, { count: number; resetAt: number }>,
  key: string,
  maxAttempts: number,
  windowMs: number,
) {
  const now = Date.now();
  let current = store.get(key);

  if (store.size >= MAX_TRACKED_RATE_LIMIT_KEYS) {
    for (const [storedKey, entry] of store) {
      if (entry.resetAt <= now) store.delete(storedKey);
    }
    if (!store.has(key) && store.size >= MAX_TRACKED_RATE_LIMIT_KEYS) {
      const oldestKey = store.keys().next().value;
      if (oldestKey !== undefined) store.delete(oldestKey);
    }
    current = store.get(key);
  }

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (current.count >= maxAttempts) return true;
  current.count += 1;
  return false;
}

export function checkStaffPasscode(submitted: string) {
  const expected = process.env.REGISTER_PASSCODE;
  return Boolean(expected && submitted && safeEqual(submitted, expected));
}
export function allowLoginAttempt(key: string) {
  return !isRateLimitedAttempt(attempts, key, 8, 15 * 60 * 1000);
}
export function createStaffToken() {
  const expires = Date.now() + SESSION_SECONDS * 1000;
  const payload = String(expires);
  return payload + "." + sign(payload);
}
export function verifyStaffToken(token?: string) {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) <= Date.now()) return false;
  try { return safeEqual(signature, sign(expires)); } catch { return false; }
}
export async function isStaffAuthenticated() {
  const cookieStore = await cookies();
  return verifyStaffToken(cookieStore.get(STAFF_COOKIE_NAME)?.value);
}
export const staffCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};
