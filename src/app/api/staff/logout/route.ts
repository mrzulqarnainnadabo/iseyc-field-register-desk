import { NextResponse } from "next/server";
import { STAFF_COOKIE_NAME, staffCookieOptions } from "@/lib/gtg-security";
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STAFF_COOKIE_NAME, "", { ...staffCookieOptions, maxAge: 0 });
  return response;
}
