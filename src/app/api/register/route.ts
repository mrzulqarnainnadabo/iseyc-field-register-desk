import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/lib/gtg-validation";
import { createRegistration } from "@/lib/gtg-notion";

export const runtime = "nodejs";

const requests = new Map<string, { count: number; resetAt: number }>();

function registrationConfigured() {
  return Boolean(
    process.env.NOTION_API_KEY &&
    process.env.NOTION_REGISTRATIONS_DB_ID
  );
}

export async function GET() {
  return NextResponse.json({ configured: registrationConfigured() });
}

function rateLimited(ip: string) {
  const now = Date.now();
  const current = requests.get(ip);
  if (!current || current.resetAt <= now) {
    requests.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  if (current.count >= 6) return true;
  current.count += 1;
  return false;
}

export async function POST(request: NextRequest) {
  if (!registrationConfigured()) {
    return NextResponse.json({ ok: false, error: "Registration is not enabled on this preview. Please use the official event registration link when it is announced." }, { status: 503 });
  }
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a little and try again." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Check the form and try again." }, { status: 400 });
  }
  try {
    const result = await createRegistration(parsed.data);
    if (result.duplicate === "same_submission") {
      return NextResponse.json({ ok: true, reference: parsed.data.clientSubmissionId, repeatedRequest: true });
    }
    if (result.duplicate === "existing_registration") {
      return NextResponse.json({ ok: false, error: "A registration with this name and phone number is already recorded. Please contact the organisers if you need help." }, { status: 409 });
    }
    return NextResponse.json({ ok: true, reference: parsed.data.clientSubmissionId });
  } catch {
    return NextResponse.json({ ok: false, error: "Registration could not be saved right now. Your details have not been confirmed. Please try again or contact the organisers." }, { status: 503 });
  }
}
