import { NextRequest, NextResponse } from "next/server";
import { outreachSessionSchema } from "@/lib/validation";
import { createOutreachSession, listRecentSessions } from "@/lib/notion";
import { authorizeRequest } from "@/lib/passcode";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Prefer session cookie; no passcode in query string
    if (!authorizeRequest(null)) {
      return NextResponse.json({ error: "Staff session required" }, { status: 401 });
    }

    const sessions = await listRecentSessions(40);
    return NextResponse.json({ sessions });
  } catch (err: any) {
    console.error("[sessions GET]", err);
    return NextResponse.json(
      {
        error: err?.message?.includes("not set")
          ? "Outreach Sessions database not configured yet"
          : "Could not load sessions",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!authorizeRequest(body.passcode ?? null)) {
      return NextResponse.json({ error: "Staff session required" }, { status: 401 });
    }

    const parsed = outreachSessionSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 });
    }

    const page = await createOutreachSession(parsed.data);
    return NextResponse.json({ id: page.id, ok: true });
  } catch (err: any) {
    console.error("[sessions POST]", err);
    return NextResponse.json(
      {
        error: err?.message?.includes("not set")
          ? "Outreach Sessions database not configured yet. Create the Notion database and set NOTION_OUTREACH_SESSIONS_DB_ID."
          : "Could not create outreach session",
      },
      { status: 500 }
    );
  }
}
