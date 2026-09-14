import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Anniversary RSVP path retired — Community Outreach Intelligence Desk only. */
export async function POST() {
  return NextResponse.json(
    { error: "RSVP is no longer available. Use the Community Outreach Desk." },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "RSVP is no longer available." },
    { status: 410 }
  );
}
