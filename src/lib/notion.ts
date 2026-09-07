import "server-only";
import { Client } from "@notionhq/client";
import type { ActivityInput, ParticipantInput, RsvpInput } from "./validation";

// This module is imported only from API routes (server). The Notion token
// never reaches the client bundle.

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

export function notionConfigStatus() {
  const required = {
    NOTION_API_KEY: getEnv("NOTION_API_KEY"),
    NOTION_RSVP_DB_ID: getEnv("NOTION_RSVP_DB_ID"),
    NOTION_ACTIVITIES_DB_ID: getEnv("NOTION_ACTIVITIES_DB_ID"),
    NOTION_PARTICIPANTS_DB_ID: getEnv("NOTION_PARTICIPANTS_DB_ID"),
  };
  const present: Record<string, boolean> = {};
  for (const key of Object.keys(required)) {
    present[key] = Boolean(required[key as keyof typeof required]);
  }
  const notionConfigured = Object.values(present).every(Boolean);
  return { notionConfigured, present };
}

let client: Client | null = null;

function getClient(): Client {
  const apiKey = getEnv("NOTION_API_KEY");
  if (!apiKey) {
    throw new Error("NOTION_API_KEY is not set");
  }
  if (!client) {
    client = new Client({ auth: apiKey });
  }
  return client;
}

function dbId(name: "rsvp" | "activities" | "participants"): string {
  const map = {
    rsvp: "NOTION_RSVP_DB_ID",
    activities: "NOTION_ACTIVITIES_DB_ID",
    participants: "NOTION_PARTICIPANTS_DB_ID",
  } as const;
  const id = getEnv(map[name]);
  if (!id) throw new Error(`${map[name]} is not set`);
  return id;
}

// ---------- Database A: Event RSVPs ----------

export async function createRsvpPage(input: RsvpInput) {
  const notion = getClient();
  return notion.pages.create({
    parent: { database_id: dbId("rsvp") },
    properties: {
      Name: { title: [{ text: { content: input.name } }] },
      Phone: { phone_number: input.phone },
      ...(input.email
        ? { Email: { email: input.email } }
        : {}),
      Role: { select: { name: input.role } },
      ...(input.organisation
        ? { Organisation: { rich_text: [{ text: { content: input.organisation } }] } }
        : {}),
      Attendance: { select: { name: input.attendance } },
      "Plus ones": { number: input.plusOnes },
      ...(input.dietaryOrAccessNote
        ? {
            "Dietary or access note": {
              rich_text: [{ text: { content: input.dietaryOrAccessNote } }],
            },
          }
        : {}),
      Consent: { checkbox: input.consent },
      Source: { select: { name: input.source } },
      // "Submitted at" is a Notion created_time property — it is set
      // automatically by Notion and must not be sent here.
    },
  });
}

// ---------- Database B: Activities ----------

export async function createActivityPage(input: ActivityInput) {
  const notion = getClient();
  const page = await notion.pages.create({
    parent: { database_id: dbId("activities") },
    properties: {
      Name: { title: [{ text: { content: input.name } }] },
      Date: { date: { start: input.date } },
      Type: { select: { name: input.type } },
      Location: { rich_text: [{ text: { content: input.location } }] },
      ...(input.notes
        ? { Notes: { rich_text: [{ text: { content: input.notes } }] } }
        : {}),
      "Recorded by": { rich_text: [{ text: { content: input.recordedBy } }] },
    },
  });
  return page;
}

export type ActivityListItem = {
  id: string;
  name: string;
  date: string | null;
  type: string | null;
  location: string | null;
};

export async function listRecentActivities(limit = 25): Promise<ActivityListItem[]> {
  const notion = getClient();
  const res = await notion.databases.query({
    database_id: dbId("activities"),
    page_size: limit,
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  return res.results.map((page) => {
    // Narrow the union type Notion returns.
    if (!("properties" in page)) {
      return { id: page.id, name: "(untitled)", date: null, type: null, location: null };
    }
    const props = page.properties as Record<string, any>;
    const name: string =
      props.Name?.title?.map((t: any) => t.plain_text).join("") ?? "(untitled)";
    const date: string | null = props.Date?.date?.start ?? null;
    const type: string | null = props.Type?.select?.name ?? null;
    const location: string | null =
      props.Location?.rich_text?.map((t: any) => t.plain_text).join("") || null;
    return { id: page.id, name, date, type, location };
  });
}

// ---------- Database C: Participants ----------

export async function createParticipantPage(input: ParticipantInput) {
  const notion = getClient();
  return notion.pages.create({
    parent: { database_id: dbId("participants") },
    properties: {
      Name: { title: [{ text: { content: input.name } }] },
      Role: { select: { name: input.role } },
      ...(input.phone ? { Phone: { phone_number: input.phone } } : {}),
      ...(input.ageGroup ? { "Age group": { select: { name: input.ageGroup } } } : {}),
      "Support received": {
        multi_select: input.supportReceived.map((name) => ({ name })),
      },
      Consent: { checkbox: input.consent },
      ...(input.notes ? { Notes: { rich_text: [{ text: { content: input.notes } }] } } : {}),
      Activity: { relation: [{ id: input.activityId }] },
    },
  });
}
