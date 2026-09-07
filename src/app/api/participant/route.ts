import { NextRequest, NextResponse } from "next/server";
import { participantSchema } from "@/lib/validation";
import { createParticipantPage, notionConfigStatus } from "@/lib/notion";
import { checkPasscode, passcodeRequired } from "@/lib/passcode";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { notionConfigured } = notionConfigStatus();
  if (!notionConfigured) {
    return NextResponse.json(
      { ok: false, error: "This desk is not connected to Notion yet. Contact the programme team." },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (passcodeRequired() && !checkPasscode(body?.passcode)) {
    return NextResponse.json({ ok: false, error: "Incorrect staff passcode" }, { status: 401 });
  }

  const parsed = participantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const page = await createParticipantPage(parsed.data);
    return NextResponse.json({ ok: true, id: page.id });
  } catch (err) {
    console.error("Participant submit failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not save this participant right now. Please try again." },
      { status: 502 }
    );
  }
}
