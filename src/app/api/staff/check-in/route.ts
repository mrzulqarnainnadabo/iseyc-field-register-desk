import { NextRequest, NextResponse } from "next/server";
import { isStaffAuthenticated } from "@/lib/gtg-security";
import { markRegistrationCheckedIn } from "@/lib/gtg-notion";
import { z } from "zod";

export const runtime = "nodejs";
const schema = z.object({ id: z.string().uuid() });
export async function POST(request: NextRequest) {
  if (!isStaffAuthenticated()) return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Select a valid registration." }, { status: 400 });
  try {
    const result = await markRegistrationCheckedIn(parsed.data.id);
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: false, error: "Check-in could not be saved. Please retry." }, { status: 503 });
  }
}
