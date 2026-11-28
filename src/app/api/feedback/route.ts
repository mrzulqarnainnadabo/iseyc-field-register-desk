import { NextRequest, NextResponse } from "next/server";
import { feedbackSchema } from "@/lib/gtg-validation";
import { createFeedback } from "@/lib/gtg-notion";
import { isRateLimitedAttempt } from "@/lib/gtg-security";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Check your feedback and try again." }, { status: 400 });
  }

  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
  if (isRateLimitedAttempt(attempts, ip, MAX_ATTEMPTS, WINDOW_MS)) {
    return NextResponse.json({ ok: false, error: "Too many feedback submissions. Please wait and try again later." }, { status: 429 });
  }

  try {
    const result = await createFeedback(parsed.data);
    return NextResponse.json({ ok: true, repeatedRequest: result.duplicate });
  } catch {
    return NextResponse.json({ ok: false, error: "Your feedback could not be saved. Please try again later." }, { status: 503 });
  }
}
