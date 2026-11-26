import { NextRequest, NextResponse } from "next/server";
import { feedbackSchema } from "@/lib/gtg-validation";
import { createFeedback } from "@/lib/gtg-notion";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (current.count >= MAX_ATTEMPTS) return true;
  current.count += 1;
  return false;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Check your feedback and try again." }, { status: 400 });
  }

  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many feedback submissions. Please wait and try again later." }, { status: 429 });
  }

  try {
    const result = await createFeedback(parsed.data);
    return NextResponse.json({ ok: true, repeatedRequest: result.duplicate });
  } catch {
    return NextResponse.json({ ok: false, error: "Your feedback could not be saved. Please try again later." }, { status: 503 });
  }
}
