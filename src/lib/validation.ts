import { z } from "zod";
import {
  PROGRAMMES,
  OUTREACH_TYPES,
  NIGERIAN_STATES,
  PARTICIPANT_GROUPS,
  AGE_BANDS,
  SEX_OPTIONS,
  RESIDENCE_OPTIONS,
  MEDICATION_ACCESS,
  MEDICATION_AFFORDABILITY,
  INVESTIGATION_ACCESS,
  INVESTIGATION_AFFORDABILITY,
  TRAVEL_TIME,
  TRANSPORT_BARRIER,
  FACILITY_AVAILABILITY,
  GENOTYPE_KNOWLEDGE,
  UNDERSTANDING_OPTIONS,
  YES_NO_NOTSURE,
  MAIN_BARRIERS,
  SUPPORT_NEEDED,
  // Legacy kept for migration safety
  ACTIVITY_TYPES,
  PARTICIPANT_ROLES,
  AGE_GROUPS,
  SUPPORT_RECEIVED,
} from "./constants";

// A forgiving phone check — staff enter numbers by hand in the field.
// Accepts digits, spaces, +, -, ( ) and requires at least 7 digits.
const phone = z
  .string()
  .trim()
  .min(1, "Phone is required")
  .refine((v) => (v.match(/\d/g) ?? []).length >= 7, "Enter a valid phone number");

const optionalPhone = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || (v.match(/\d/g) ?? []).length >= 7, "Enter a valid phone number");

// ---------- New core schemas ----------

export const outreachSessionSchema = z.object({
  programme: z.enum(PROGRAMMES),
  date: z.string().trim().min(1, "Date is required"), // yyyy-mm-dd
  state: z.enum(NIGERIAN_STATES),
  lga: z.string().trim().min(1, "LGA is required").max(120),
  ward: z.string().trim().max(120).optional().or(z.literal("")),
  community: z.string().trim().min(1, "Community is required").max(150),
  venue: z.string().trim().max(200).optional().or(z.literal("")),
  outreachType: z.enum(OUTREACH_TYPES),
  fieldLead: z.string().trim().min(1, "Field lead is required").max(100),
  teamSize: z.coerce.number().int().min(1).max(50).default(1),
});
export type OutreachSessionInput = z.infer<typeof outreachSessionSchema>;

export const communityResponseSchema = z.object({
  sessionId: z.string().trim().min(1, "Select or create an outreach session first"),
  clientSubmissionId: z.string().trim().min(8, "Client submission ID is required"), // idempotency key

  // Identification (minimised)
  participantGroup: z.enum(PARTICIPANT_GROUPS),
  ageBand: z.enum(AGE_BANDS).optional(),
  sex: z.enum(SEX_OPTIONS).optional(),
  residence: z.enum(RESIDENCE_OPTIONS).optional(),

  // Access & Affordability
  medicationAccess: z.enum(MEDICATION_ACCESS).optional(),
  medicationAffordability: z.enum(MEDICATION_AFFORDABILITY).optional(),
  investigationAccess: z.enum(INVESTIGATION_ACCESS).optional(),
  investigationAffordability: z.enum(INVESTIGATION_AFFORDABILITY).optional(),
  travelTime: z.enum(TRAVEL_TIME).optional(),
  transportBarrier: z.enum(TRANSPORT_BARRIER).optional(),
  facilityAvailability: z.enum(FACILITY_AVAILABILITY).optional(),

  // Knowledge & Awareness
  knowsGenotype: z.enum(GENOTYPE_KNOWLEDGE).optional(),
  understandsGenotype: z.enum(UNDERSTANDING_OPTIONS).optional(),
  knowsWhereToSeekHelp: z.enum(YES_NO_NOTSURE).optional(),
  knowsRegularCareHelps: z.enum(YES_NO_NOTSURE).optional(),
  knowsWhenUrgent: z.enum(YES_NO_NOTSURE).optional(),

  // Barriers & Needs
  mainBarriers: z.array(z.enum(MAIN_BARRIERS)).default([]),
  supportNeeded: z.array(z.enum(SUPPORT_NEEDED)).default([]),

  // Consent
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to save this record" }),
  }),

  // Optional follow-up pathway
  followUpRequested: z.boolean().default(false),
  preferredChannel: z.enum(["Phone", "WhatsApp", "Other"]).optional(),
  contact: optionalPhone,
});
export type CommunityResponseInput = z.infer<typeof communityResponseSchema>;

export const followUpSchema = z.object({
  responseId: z.string().trim().min(1),
  followUpRequested: z.boolean(),
  preferredChannel: z.enum(["Phone", "WhatsApp", "Other"]).optional(),
  contact: optionalPhone,
  requestedSupport: z.string().trim().max(200).optional(),
  assignedTo: z.string().trim().max(100).optional(),
  status: z.enum(["Pending", "Contacted", "Referred", "Closed"]).default("Pending"),
  outcome: z.string().trim().max(300).optional(),
});
export type FollowUpInput = z.infer<typeof followUpSchema>;

// ---------- Legacy schemas (kept temporarily for migration safety) ----------

export const activitySchema = z.object({
  name: z.string().trim().min(2, "Activity name is required"),
  date: z.string().trim().min(1, "Date is required"),
  type: z.enum(ACTIVITY_TYPES),
  location: z.string().trim().min(1, "Location is required"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  recordedBy: z.string().trim().min(1, "Recorded by is required"),
});
export type ActivityInput = z.infer<typeof activitySchema>;

export const participantSchema = z.object({
  activityId: z.string().trim().min(1, "Select an activity first"),
  name: z.string().trim().min(2, "Full name is required"),
  role: z.enum(PARTICIPANT_ROLES),
  phone: optionalPhone,
  ageGroup: z.enum(AGE_GROUPS).optional(),
  supportReceived: z.array(z.enum(SUPPORT_RECEIVED)).min(1, "Select at least one"),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to save this record" }),
  }),
});
export type ParticipantInput = z.infer<typeof participantSchema>;
