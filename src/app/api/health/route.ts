import { NextRequest, NextResponse } from "next/server";
import { notionConfigStatus } from "@/lib/notion";
import { authorizeRequest, passcodeRequired } from "@/lib/passcode";

export const runtime = "nodejs";

/** Public health — minimal surface */
export async function GET(req: NextRequest) {
  // Detailed diagnostics only when staff session is present or passcode gate is off
  const wantDetail = req.nextUrl.searchParams.get("detail") === "1";

  if (!wantDetail) {
    return NextResponse.json({ ok: true });
  }

  if (passcodeRequired() && !authorizeRequest(null)) {
    return NextResponse.json({ ok: true }); // hide config from public
  }

  const { notionConfigured, present } = notionConfigStatus();
  return NextResponse.json({
    ok: true,
    notionConfigured,
    env: present,
    staffPasscodeEnabled: passcodeRequired(),
  });
}
