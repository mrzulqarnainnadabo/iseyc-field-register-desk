import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const STAFF_COOKIE_NAME = "gtg_staff_session";
const SESSION_SECONDS = 8 * 60 * 60;
const attempts = new Map<string, { count: number; resetAt: number }>();

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
export function checkStaffPasscode(submitted: string) {
  const expected = process.env.REGISTER_PASSCODE;
  return Boolean(expected && submitted && safeEqual(submitted, expected));
}
export function allowLoginAttempt(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (current.count >= 8) return false;
  current.count += 1;
  return true;
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
