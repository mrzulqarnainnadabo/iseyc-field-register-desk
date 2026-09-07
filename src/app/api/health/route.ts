import { NextResponse } from "next/server";
import { notionConfigStatus } from "@/lib/notion";
import { passcodeRequired } from "@/lib/passcode";

export const runtime = "nodejs";

export async function GET() {
  const { notionConfigured, present } = notionConfigStatus();
  return NextResponse.json({
    ok: true,
    notionConfigured,
    env: present, // booleans only — never the actual secret values
    staffPasscodeEnabled: passcodeRequired(),
  });
}
