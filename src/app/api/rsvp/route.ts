import { NextRequest, NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/validation";
import { createRsvpPage, notionConfigStatus } from "@/lib/notion";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { notionConfigured } = notionConfigStatus();
  if (!notionConfigured) {
    return NextResponse.json(
      { ok: false, error: "This desk is not connected to Notion yet. Contact the programme team." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const page = await createRsvpPage(parsed.data);
    return NextResponse.json({ ok: true, id: page.id });
  } catch (err) {
    console.error("RSVP submit failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your RSVP right now. Please try again." },
      { status: 502 }
    );
  }
}
