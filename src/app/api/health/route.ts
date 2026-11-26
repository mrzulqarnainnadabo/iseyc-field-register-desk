import { NextRequest, NextResponse } from "next/server";
import { notionConfigStatus } from "@/lib/notion";
import { authorizeRequest, passcodeRequired } from "@/lib/passcode";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const wantDetail = req.nextUrl.searchParams.get("detail") === "1";
  if (!wantDetail) return NextResponse.json({ ok: true });
  if (passcodeRequired() && !(await authorizeRequest(null))) return NextResponse.json({ ok: true });
  const { notionConfigured, present } = notionConfigStatus();
  return NextResponse.json({ ok: true, notionConfigured, env: present, staffPasscodeEnabled: passcodeRequired() });
}
