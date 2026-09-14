import { NextRequest, NextResponse } from "next/server";
import { communityResponseSchema } from "@/lib/validation";
import { createCommunityResponse } from "@/lib/notion";
import { authorizeRequest } from "@/lib/passcode";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!authorizeRequest(body.passcode ?? null)) {
      return NextResponse.json({ error: "Staff session required" }, { status: 401 });
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

    const page = await createCommunityResponse(parsed.data);
    return NextResponse.json({ id: page.id, ok: true });
  } catch (err: any) {
    console.error("[responses POST]", err);
    return NextResponse.json(
      {
        error: err?.message?.includes("not set")
          ? "Community Responses database not configured yet"
          : "Could not save response",
      },
      { status: 500 }
    );
  }
}
