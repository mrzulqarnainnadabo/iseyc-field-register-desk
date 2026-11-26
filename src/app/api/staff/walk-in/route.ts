import { NextRequest, NextResponse } from "next/server";
import { isStaffAuthenticated } from "@/lib/gtg-security";
import { createRegistration } from "@/lib/gtg-notion";
import { registrationSchema } from "@/lib/gtg-validation";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!isStaffAuthenticated()) return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Check the guest details." }, { status: 400 });
  try {
    const result = await createRegistration(parsed.data, "Walk-in");
    if (result.duplicate === "existing_registration") return NextResponse.json({ ok: false, error: "This guest is already registered. Search for the existing record and check them in." }, { status: 409 });
    return NextResponse.json({ ok: true, reference: parsed.data.clientSubmissionId, repeatedRequest: result.duplicate === "same_submission" });
  } catch {
    return NextResponse.json({ ok: false, error: "Walk-in could not be saved. No attendance record has been confirmed." }, { status: 503 });
  }
}
