import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { authorizeRequest } from "@/lib/passcode";

export const runtime = "nodejs";

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

function rate(
  numerator: number,
  denominator: number
): { value: number; numerator: number; denominator: number } {
  if (denominator === 0) return { value: 0, numerator: 0, denominator: 0 };
  return {
    value: Math.round((numerator / denominator) * 100),
    numerator,
    denominator,
  };
}

const DIFFICULT_MED = new Set(["Often difficult", "Very difficult / unavailable"]);
const UNAFFORDABLE_INV = new Set(["Usually unaffordable", "Completely unaffordable"]);
const GENOTYPE_GAP = new Set(["No", "Not sure"]);
const LONG_TRAVEL = new Set(["1–2 hours", "More than 2 hours"]);

export async function GET() {
  try {
    if (!authorizeRequest(null)) {
      return NextResponse.json({ error: "Staff session required" }, { status: 401 });
    }

    const apiKey = getEnv("NOTION_API_KEY");
    const responsesDb = getEnv("NOTION_RESPONSES_DB_ID");
    if (!apiKey || !responsesDb) {
      return NextResponse.json({
        error: "Community Responses database not configured",
        sampleSize: 0,
        indicators: null,
      });
    }

    const notion = new Client({ auth: apiKey });
    const res = await notion.databases.query({
      database_id: responsesDb,
      page_size: 100,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    let medAccessDiff = 0;
    let medAccessTotal = 0;
    let invAffordDiff = 0;
    let invAffordTotal = 0;
    let genotypeGap = 0;
    let genotypeTotal = 0;
    let longTravel = 0;
    let travelTotal = 0;
    let warriors = 0;
    let sampleSize = 0;

    for (const page of res.results) {
      if (!("properties" in page)) continue;
      const props = page.properties as Record<string, any>;
      sampleSize += 1;

      const group = props["Participant Group"]?.select?.name;
      if (group === "Warrior") warriors += 1;

      const med = props["Medication Access"]?.select?.name;
      if (med && med !== "Not applicable" && med !== "Prefer not to answer") {
        medAccessTotal += 1;
        if (DIFFICULT_MED.has(med)) medAccessDiff += 1;
      }

      const inv = props["Investigation Affordability"]?.select?.name;
      if (inv && inv !== "Not applicable" && inv !== "Prefer not to answer") {
        invAffordTotal += 1;
        if (UNAFFORDABLE_INV.has(inv)) invAffordDiff += 1;
      }

      const geno = props["Knows Genotype"]?.select?.name;
      if (geno && geno !== "Prefer not to answer") {
        genotypeTotal += 1;
        if (GENOTYPE_GAP.has(geno)) genotypeGap += 1;
      }

      const travel = props["Travel Time"]?.select?.name;
      if (travel && travel !== "No regular facility") {
        travelTotal += 1;
        if (LONG_TRAVEL.has(travel)) longTravel += 1;
      }
    }

    return NextResponse.json({
      sampleSize,
      warriors,
      indicators: {
        medicationAccessDifficulty: rate(medAccessDiff, medAccessTotal),
        investigationAffordability: rate(invAffordDiff, invAffordTotal),
        genotypeKnowledgeGap: rate(genotypeGap, genotypeTotal),
        longTravel: rate(longTravel, travelTotal),
      },
      note:
        sampleSize === 0
          ? "No responses yet. Start an outreach session to begin collecting evidence."
          : `Based on ${sampleSize} most recent responses.`,
    });
  } catch (err: any) {
    console.error("[insights GET]", err);
    return NextResponse.json(
      { error: err?.message ?? "Could not compute insights", sampleSize: 0 },
      { status: 500 }
    );
  }
}
