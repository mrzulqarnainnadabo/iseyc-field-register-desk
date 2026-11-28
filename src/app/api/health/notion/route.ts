import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { feedbackDbId, registrationDbId } from "@/lib/gtg-notion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Operational probe: confirms the configured integration can read both databases
// without returning guest records, feedback content, IDs or credentials.
export async function GET() {
  const token = process.env.NOTION_API_KEY;
  if (!token) {
    return NextResponse.json({ ok: false, configured: false, message: "Notion integration is not configured." }, { status: 503 });
  }

  try {
    const notion = new Client({ auth: token });
    await Promise.all([
      notion.databases.query({ database_id: registrationDbId(), page_size: 1 }),
      notion.databases.query({ database_id: feedbackDbId(), page_size: 1 }),
    ]);

    return NextResponse.json({
      ok: true,
      configured: true,
      databases: {
        registrations: "connected",
        feedback: "connected",
      },
      checkedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({
      ok: false,
      configured: true,
      databases: {
        registrations: "unverified",
        feedback: "unverified",
      },
      message: "The Notion integration could not read both configured databases. Check database sharing and integration permissions.",
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
