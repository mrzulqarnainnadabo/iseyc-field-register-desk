import { NextRequest, NextResponse } from "next/server";
import { isStaffAuthenticated } from "@/lib/gtg-security";
import { searchRegistrations } from "@/lib/gtg-notion";

export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  if (!(await isStaffAuthenticated())) return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  try {
    const query = request.nextUrl.searchParams.get("q") || "";
    const cursor = request.nextUrl.searchParams.get("cursor") || undefined;
    const result = await searchRegistrations(query, cursor);
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: false, error: "The registration list is temporarily unavailable." }, { status: 503 });
  }
}
