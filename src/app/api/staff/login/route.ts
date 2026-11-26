import { NextRequest, NextResponse } from "next/server";
import { allowLoginAttempt, checkStaffPasscode, createStaffToken, STAFF_COOKIE_NAME, staffCookieOptions } from "@/lib/gtg-security";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
  if (!allowLoginAttempt(ip)) return NextResponse.json({ ok: false, error: "Too many attempts. Try again later." }, { status: 429 });
  const body = await request.json().catch(() => ({}));
  const passcode = typeof body.passcode === "string" ? body.passcode : "";
  if (!checkStaffPasscode(passcode)) return NextResponse.json({ ok: false, error: "Access code not recognised." }, { status: 401 });
  try {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(STAFF_COOKIE_NAME, createStaffToken(), staffCookieOptions);
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Staff access is not configured. Contact the system administrator." }, { status: 503 });
  }
}
