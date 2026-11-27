import { NextRequest, NextResponse } from "next/server";
import { allowLoginAttempt, checkStaffPasscode, createStaffToken, STAFF_COOKIE_NAME, staffCookieOptions } from "@/lib/gtg-security";
import { canAccessRegistrationDatabase } from "@/lib/gtg-notion";

export const runtime = "nodejs";

function staffConfigured() {
  return Boolean(
    process.env.REGISTER_PASSCODE &&
    process.env.SESSION_SECRET &&
    process.env.SESSION_SECRET.length >= 32 &&
    process.env.NOTION_API_KEY &&
    process.env.NOTION_REGISTRATIONS_DB_ID
  );
}

export async function GET() {
  const configured = staffConfigured() && await canAccessRegistrationDatabase();
  return NextResponse.json({ configured }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!staffConfigured()) return NextResponse.json({ ok: false, error: "Staff access is not enabled in this preview environment." }, { status: 503 });
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
