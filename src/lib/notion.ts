import "server-only";
import { Client } from "@notionhq/client";
import type {
  ActivityInput,
  ParticipantInput,
  OutreachSessionInput,
  CommunityResponseInput,
} from "./validation";

// This module is imported only from API routes (server). The Notion token
// never reaches the client bundle.

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

export function notionConfigStatus() {
  const present: Record<string, boolean> = {
    NOTION_API_KEY: Boolean(getEnv("NOTION_API_KEY")),
    // New intelligence model
    NOTION_OUTREACH_SESSIONS_DB_ID: Boolean(getEnv("NOTION_OUTREACH_SESSIONS_DB_ID")),
    NOTION_RESPONSES_DB_ID: Boolean(getEnv("NOTION_RESPONSES_DB_ID")),
    NOTION_FOLLOWUPS_DB_ID: Boolean(getEnv("NOTION_FOLLOWUPS_DB_ID")),
    // Legacy (kept during migration)
    NOTION_RSVP_DB_ID: Boolean(getEnv("NOTION_RSVP_DB_ID")),
    NOTION_ACTIVITIES_DB_ID: Boolean(getEnv("NOTION_ACTIVITIES_DB_ID")),
    NOTION_PARTICIPANTS_DB_ID: Boolean(getEnv("NOTION_PARTICIPANTS_DB_ID")),
  };

  // Desk is considered configured if API key + at least the activities path still works
  // (or the new sessions path is ready).
  const notionConfigured =
    present.NOTION_API_KEY &&
    (present.NOTION_ACTIVITIES_DB_ID || present.NOTION_OUTREACH_SESSIONS_DB_ID);

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

function dbId(
  name:
    | "rsvp"
    | "activities"
    | "participants"
    | "sessions"
    | "responses"
    | "followups"
): string {
  const map = {
    rsvp: "NOTION_RSVP_DB_ID",
    activities: "NOTION_ACTIVITIES_DB_ID",
    participants: "NOTION_PARTICIPANTS_DB_ID",
    sessions: "NOTION_OUTREACH_SESSIONS_DB_ID",
    responses: "NOTION_RESPONSES_DB_ID",
    followups: "NOTION_FOLLOWUPS_DB_ID",
  } as const;
  const id = getEnv(map[name]);
  if (!id) throw new Error(`${map[name]} is not set`);
  return id;
}

// ============================================================
// NEW MODEL — Outreach Sessions + Community Responses
// ============================================================

export async function createOutreachSession(input: OutreachSessionInput) {
  const notion = getClient();
  const title = `${input.community} · ${input.programme} · ${input.date}`;

  const page = await notion.pages.create({
    parent: { database_id: dbId("sessions") },
    properties: {
      Name: { title: [{ text: { content: title } }] },
      Programme: { select: { name: input.programme } },
      Date: { date: { start: input.date } },
      State: { select: { name: input.state } },
      LGA: { rich_text: [{ text: { content: input.lga } }] },
      ...(input.ward
        ? { Ward: { rich_text: [{ text: { content: input.ward } }] } }
        : {}),
      Community: { rich_text: [{ text: { content: input.community } }] },
      ...(input.venue
        ? { Venue: { rich_text: [{ text: { content: input.venue } }] } }
        : {}),
      "Outreach Type": { select: { name: input.outreachType } },
      "Field Lead": { rich_text: [{ text: { content: input.fieldLead } }] },
      "Team Size": { number: input.teamSize },
      Status: { select: { name: "Active" } },
    },
  });
  return page;
}

export type SessionListItem = {
  id: string;
  name: string;
  date: string | null;
  programme: string | null;
  community: string | null;
  lga: string | null;
  state: string | null;
};

export async function listRecentSessions(limit = 30): Promise<SessionListItem[]> {
  const notion = getClient();
  const res = await notion.databases.query({
    database_id: dbId("sessions"),
    page_size: limit,
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  return res.results.map((page) => {
    if (!("properties" in page)) {
      return {
        id: page.id,
        name: "(untitled)",
        date: null,
        programme: null,
        community: null,
        lga: null,
        state: null,
      };
    }
    const props = page.properties as Record<string, any>;
    return {
      id: page.id,
      name: props.Name?.title?.map((t: any) => t.plain_text).join("") ?? "(untitled)",
      date: props.Date?.date?.start ?? null,
      programme: props.Programme?.select?.name ?? null,
      community: props.Community?.rich_text?.map((t: any) => t.plain_text).join("") || null,
      lga: props.LGA?.rich_text?.map((t: any) => t.plain_text).join("") || null,
      state: props.State?.select?.name ?? null,
    };
  });
}

export async function createCommunityResponse(input: CommunityResponseInput) {
  const notion = getClient();

  // Title is intentionally non-identifying for privacy
  const title = `${input.participantGroup} · ${new Date().toISOString().slice(0, 10)}`;

  const properties: Record<string, any> = {
    Name: { title: [{ text: { content: title } }] },
    Session: { relation: [{ id: input.sessionId }] },
    "Participant Group": { select: { name: input.participantGroup } },
    Consent: { checkbox: input.consent },
    "Client Submission ID": {
      rich_text: [{ text: { content: input.clientSubmissionId } }],
    },
  };

  // Optional demographic bands
  if (input.ageBand) properties["Age Band"] = { select: { name: input.ageBand } };
  if (input.sex) properties.Sex = { select: { name: input.sex } };
  if (input.residence) properties.Residence = { select: { name: input.residence } };

  // Access & Affordability
  if (input.medicationAccess)
    properties["Medication Access"] = { select: { name: input.medicationAccess } };
  if (input.medicationAffordability)
    properties["Medication Affordability"] = {
      select: { name: input.medicationAffordability },
    };
  if (input.investigationAccess)
    properties["Investigation Access"] = { select: { name: input.investigationAccess } };
  if (input.investigationAffordability)
    properties["Investigation Affordability"] = {
      select: { name: input.investigationAffordability },
    };
  if (input.travelTime) properties["Travel Time"] = { select: { name: input.travelTime } };
  if (input.transportBarrier)
    properties["Transport Barrier"] = { select: { name: input.transportBarrier } };
  if (input.facilityAvailability)
    properties["Facility Availability"] = {
      select: { name: input.facilityAvailability },
    };

  // Knowledge
  if (input.knowsGenotype)
    properties["Knows Genotype"] = { select: { name: input.knowsGenotype } };
  if (input.understandsGenotype)
    properties["Understands Genotype"] = {
      select: { name: input.understandsGenotype },
    };
  if (input.knowsWhereToSeekHelp)
    properties["Knows Where to Seek Help"] = {
      select: { name: input.knowsWhereToSeekHelp },
    };
  if (input.knowsRegularCareHelps)
    properties["Knows Regular Care Helps"] = {
      select: { name: input.knowsRegularCareHelps },
    };
  if (input.knowsWhenUrgent)
    properties["Knows When Urgent"] = { select: { name: input.knowsWhenUrgent } };

  // Multi-selects
  if (input.mainBarriers?.length) {
    properties["Main Barriers"] = {
      multi_select: input.mainBarriers.map((name) => ({ name })),
    };
  }
  if (input.supportNeeded?.length) {
    properties["Support Needed"] = {
      multi_select: input.supportNeeded.map((name) => ({ name })),
    };
  }

  // Follow-up pathway (optional)
  if (input.followUpRequested) {
    properties["Follow-up Requested"] = { checkbox: true };
    if (input.preferredChannel)
      properties["Preferred Channel"] = { select: { name: input.preferredChannel } };
    if (input.contact) properties.Contact = { phone_number: input.contact };
  }

  return notion.pages.create({
    parent: { database_id: dbId("responses") },
    properties,
  });
}

// ============================================================
// LEGACY MODEL — kept during migration so existing field work continues
// ============================================================

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
