import { z } from "zod";
import {
  ACTIVITY_TYPES,
  AGE_GROUPS,
  PARTICIPANT_ROLES,
  RSVP_ATTENDANCE,
  RSVP_ROLES,
  RSVP_SOURCES,
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

export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  phone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  role: z.enum(RSVP_ROLES),
  organisation: z.string().trim().max(200).optional().or(z.literal("")),
  attendance: z.enum(RSVP_ATTENDANCE),
  plusOnes: z.coerce.number().int().min(0).max(5).default(0),
  dietaryOrAccessNote: z.string().trim().max(300).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to save this record" }),
  }),
  source: z.enum(RSVP_SOURCES).default("Register Desk"),
});
export type RsvpInput = z.infer<typeof rsvpSchema>;

export const activitySchema = z.object({
  name: z.string().trim().min(2, "Activity name is required"),
  date: z.string().trim().min(1, "Date is required"), // yyyy-mm-dd from <input type="date">
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
