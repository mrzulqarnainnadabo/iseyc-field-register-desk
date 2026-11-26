import { NextRequest, NextResponse } from "next/server";
import { feedbackSchema } from "@/lib/gtg-validation";
import { createFeedback } from "@/lib/gtg-notion";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Check your feedback and try again." }, { status: 400 });
  }
  try {
    const result = await createFeedback(parsed.data);
    return NextResponse.json({ ok: true, repeatedRequest: result.duplicate });
  } catch {
    return NextResponse.json({ ok: false, error: "Your feedback could not be saved. Please try again later." }, { status: 503 });
  }
}
