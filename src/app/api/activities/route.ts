import { NextRequest, NextResponse } from "next/server";
import { listRecentActivities, notionConfigStatus } from "@/lib/notion";
import { checkPasscode, passcodeRequired } from "@/lib/passcode";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { notionConfigured } = notionConfigStatus();
  if (!notionConfigured) {
    return NextResponse.json({ ok: true, activities: [] });
  }

  if (passcodeRequired()) {
    const passcode = req.nextUrl.searchParams.get("passcode");
    if (!checkPasscode(passcode)) {
      return NextResponse.json({ ok: false, error: "Incorrect staff passcode" }, { status: 401 });
    }
  }

  try {
    const activities = await listRecentActivities();
    return NextResponse.json({ ok: true, activities });
  } catch (err) {
    console.error("List activities failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not load activities right now." },
      { status: 502 }
    );
  }
}
