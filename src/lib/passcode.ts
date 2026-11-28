import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "iseyc_staff_session";
const SESSION_MAX_AGE = 60 * 60 * 12;

export function passcodeRequired(): boolean { return true; }
function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function checkPasscode(submitted: string | undefined | null): boolean {
  const expected = process.env.REGISTER_PASSCODE;
  return Boolean(expected && submitted && safeEqual(submitted, expected));
}
export function issueSessionToken(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be configured with at least 32 characters");
  const expires = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = String(expires);
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return payload + "." + signature;
}
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) <= Date.now()) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  const expected = createHmac("sha256", secret).update(expires).digest("base64url");
  return safeEqual(signature, expected);
}
export async function getSessionFromCookies(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
  } catch { return false; }
}
export async function authorizeRequest(bodyPasscode?: string | null): Promise<boolean> {
  return (await getSessionFromCookies()) || checkPasscode(bodyPasscode);
}
export const STAFF_COOKIE = {
  name: COOKIE_NAME,
  maxAge: SESSION_MAX_AGE,
  options: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: SESSION_MAX_AGE },
};
const attempts = new Map<string, { count: number; resetAt: number }>();
export function rateLimitUnlock(ip: string, limit = 8, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) { attempts.set(ip, { count: 1, resetAt: now + windowMs }); return { allowed: true }; }
  if (entry.count >= limit) return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  entry.count += 1;
  return { allowed: true };
}
