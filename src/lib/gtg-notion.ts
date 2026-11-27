import "server-only";
import { Client } from "@notionhq/client";
import { GTG } from "./gtg-config";
import type { RegistrationInput, FeedbackInput } from "./gtg-validation";

let notionClient: Client | undefined;
function env(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("Missing required server configuration: " + name);
  return value;
}
function notion() {
  if (!notionClient) notionClient = new Client({ auth: env("NOTION_API_KEY") });
  return notionClient;
}
function normalizeId(value: string) { return value.replace(/-/g, "").toLowerCase(); }
export function registrationDbId() { return env("NOTION_REGISTRATIONS_DB_ID"); }
export function feedbackDbId() { return env("NOTION_FEEDBACK_DB_ID"); }

export async function canAccessRegistrationDatabase(): Promise<boolean> {
  try {
    await notion().databases.query({ database_id: registrationDbId(), page_size: 1 });
    return true;
  } catch {
    return false;
  }
}

export async function createRegistration(input: RegistrationInput, channel: "Online" | "Walk-in" = "Online") {
  const api = notion();
  const databaseId = registrationDbId();
  const bySubmission = await api.databases.query({
    database_id: databaseId,
    filter: { property: "Client Submission ID", rich_text: { equals: input.clientSubmissionId } },
    page_size: 1,
  });
  const existingSubmission = bySubmission.results[0];
  if (existingSubmission) return { duplicate: "same_submission" as const, pageId: existingSubmission.id };

  const byPerson = await api.databases.query({
    database_id: databaseId,
    filter: { and: [
      { property: "Name", title: { equals: input.name } },
      { property: "Phone", phone_number: { equals: input.phone } },
    ] },
    page_size: 1,
  });
  if (byPerson.results.length) return { duplicate: "existing_registration" as const };

  const properties: Record<string, any> = {
    Name: { title: [{ text: { content: input.name } }] },
    Phone: { phone_number: input.phone },
    "Age Band": { select: { name: input.ageBand } },
    "Attendance Status": { select: { name: channel === "Walk-in" ? "Checked in" : "Registered" } },
    Channel: { select: { name: channel } },
    "Client Submission ID": { rich_text: [{ text: { content: input.clientSubmissionId } }] },
    Consent: { checkbox: true },
    Event: { rich_text: [{ text: { content: GTG.eventName } }] },
    "Returning Guest": { checkbox: input.returningGuest },
    Source: { select: { name: input.source } },
    "Support Needs": { rich_text: input.supportNeeds ? [{ text: { content: input.supportNeeds } }] : [] },
  };
  if (channel === "Walk-in") properties["Checked In At"] = { date: { start: new Date().toISOString() } };
  const page = await api.pages.create({ parent: { database_id: databaseId }, properties });
  return { duplicate: null, pageId: page.id };
}

export async function createFeedback(input: FeedbackInput) {
  const api = notion();
  const databaseId = feedbackDbId();
  const existing = await api.databases.query({
    database_id: databaseId,
    filter: { property: "Client Submission ID", rich_text: { equals: input.clientSubmissionId } },
    page_size: 1,
  });
  if (existing.results.length) return { duplicate: true };

  await api.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: "Anonymous feedback — " + new Date().toISOString().slice(0, 10) } }] },
      "Client Submission ID": { rich_text: [{ text: { content: input.clientSubmissionId } }] },
      Event: { rich_text: [{ text: { content: GTG.eventName } }] },
      "Overall Rating": { number: input.rating },
      "What Landed": { multi_select: input.whatLanded.map((name) => ({ name })) },
      "What Landed Note": { rich_text: input.whatLandedNote ? [{ text: { content: input.whatLandedNote } }] : [] },
      "What I Need Next": { multi_select: input.whatNext.map((name) => ({ name })) },
      "Need Next Note": { rich_text: input.whatNextNote ? [{ text: { content: input.whatNextNote } }] : [] },
    },
  });
  return { duplicate: false };
}

export async function searchRegistrations(query: string, cursor?: string) {
  const api = notion();
  const databaseId = registrationDbId();
  const clean = query.trim();
  const response = await api.databases.query({
    database_id: databaseId,
    ...(clean ? { filter: { or: [
      { property: "Name", title: { contains: clean } },
      { property: "Phone", phone_number: { equals: clean } },
      { property: "Client Submission ID", rich_text: { contains: clean } },
    ] } } : {}),
    page_size: 30,
    ...(cursor ? { start_cursor: cursor } : {}),
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  const registrations = response.results.flatMap((page) => {
    if (!("properties" in page)) return [];
    const properties = page.properties as Record<string, any>;
    const text = (value: any) => value?.map((part: any) => part.plain_text).join("") || "";
    return [{
      id: page.id,
      name: text(properties.Name?.title),
      phone: properties.Phone?.phone_number || "",
      ageBand: properties["Age Band"]?.select?.name || "",
      status: properties["Attendance Status"]?.select?.name || "Registered",
      channel: properties.Channel?.select?.name || "Online",
      submissionId: text(properties["Client Submission ID"]?.rich_text),
      checkedInAt: properties["Checked In At"]?.date?.start || null,
    }];
  });
  return { registrations, hasMore: response.has_more, nextCursor: response.next_cursor };
}

export async function markRegistrationCheckedIn(pageId: string) {
  const api = notion();
  const current = await api.pages.retrieve({ page_id: pageId });
  if (!("properties" in current)) throw new Error("Registration record not found");
  const parent = current.parent;
  if (parent.type !== "database_id" || normalizeId(parent.database_id) !== normalizeId(registrationDbId())) {
    throw new Error("Record does not belong to the registration database");
  }
  const properties = current.properties as Record<string, any>;
  if (properties["Attendance Status"]?.select?.name === "Checked in") {
    return { alreadyCheckedIn: true, checkedInAt: properties["Checked In At"]?.date?.start || null };
  }
  const now = new Date().toISOString();
  await api.pages.update({
    page_id: pageId,
    properties: {
      "Attendance Status": { select: { name: "Checked in" } },
      "Checked In At": { date: { start: now } },
    },
  });
  return { alreadyCheckedIn: false, checkedInAt: now };
}
