import { NextRequest, NextResponse } from "next/server";
import {
  checkPasscode,
  issueSessionToken,
  passcodeRequired,
  rateLimitUnlock,
  STAFF_COOKIE,
} from "@/lib/passcode";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!passcodeRequired()) {
      const res = NextResponse.json({ ok: true, unlocked: true, gated: false });
      return res;
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const limited = rateLimitUnlock(ip);
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: limited.retryAfterSec
            ? { "Retry-After": String(limited.retryAfterSec) }
            : undefined,
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const passcode = typeof body.passcode === "string" ? body.passcode : "";

    if (!checkPasscode(passcode)) {
      return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
    }

    const token = issueSessionToken();
    const res = NextResponse.json({ ok: true, unlocked: true, gated: true });
    res.cookies.set(STAFF_COOKIE.name, token, STAFF_COOKIE.options);
    return res;
  } catch (err) {
    console.error("[auth/unlock]", err);
    return NextResponse.json({ error: "Could not unlock" }, { status: 500 });
  }
}
