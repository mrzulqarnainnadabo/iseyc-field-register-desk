import { NextRequest, NextResponse } from "next/server";
import { communityResponseSchema } from "@/lib/validation";
import { createCommunityResponse } from "@/lib/notion";
import { passcodeRequired, checkPasscode } from "@/lib/passcode";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (passcodeRequired()) {
      if (!checkPasscode(body.passcode ?? "")) {
        return NextResponse.json({ error: "Invalid or missing passcode" }, { status: 401 });
      }
    }

    const parsed = communityResponseSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 });
    }

    // Note: true idempotency (checking clientSubmissionId) requires a Notion query.
    // For MVP we accept the key and rely on the client to generate a stable UUID per response.
    // Phase 2 can add a uniqueness check once the Responses DB is live.

    const page = await createCommunityResponse(parsed.data);
    return NextResponse.json({ id: page.id, ok: true });
  } catch (err: any) {
    console.error("[responses POST]", err);
    return NextResponse.json(
      {
        error: err?.message?.includes("not set")
          ? "Community Responses database not configured yet. Create the Notion database and set NOTION_RESPONSES_DB_ID."
          : "Could not save community response",
      },
      { status: 500 }
    );
  }
}
