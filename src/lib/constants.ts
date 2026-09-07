// Single source of truth for event facts and Notion select options.
// Keep these in sync with the exact option names configured on the Notion databases.

export const EVENT = {
  programme: "Tirngan Sickle Cell Foundation",
  name: "5th Anniversary Dinner & Recognition Ceremony",
  theme: "Five Years of Breaking Cycles and Building Futures",
  date: "Friday, 18 September 2026",
  isoCutoff: "2026-09-18T23:59:59+01:00",
  redCarpet: "4:00 PM",
  dinner: "5:00 PM Prompt",
  venue: "LIMCEEG Multipurpose Event Centre, Karji, Yakowa Express Way",
} as const;

export const ORG = {
  name: "ISEYC",
  fullName: "Initiative for Sustainable Evolution for Youth and Community",
  supportLine: `In support of ${EVENT.programme}`,
} as const;

// --- RSVP (Database A) ---
export const RSVP_ROLES = [
  "Guest",
  "Caregiver",
  "Warrior",
  "Volunteer",
  "Staff",
  "Partner",
  "Media",
  "Other",
] as const;

export const RSVP_ATTENDANCE = ["Will attend", "Maybe", "Cannot attend"] as const;

export const RSVP_SOURCES = ["Register Desk", "WhatsApp", "Referral", "Other"] as const;

// --- Activities (Database B) ---
export const ACTIVITY_TYPES = [
  "Genotype testing",
  "Medication support",
  "Counseling",
  "Community outreach",
  "School/hospital visit",
  "Caregiver session",
  "Anniversary event",
  "Other",
] as const;

// --- Participants (Database C) ---
export const PARTICIPANT_ROLES = [
  "Warrior (living with SCD)",
  "Caregiver",
  "Volunteer",
  "Staff",
  "Partner",
  "Community member",
  "Other",
] as const;

export const AGE_GROUPS = ["Child", "Youth", "Adult", "Prefer not to say"] as const;

export const SUPPORT_RECEIVED = [
  "Genotype test",
  "Medication",
  "Counseling",
  "Education only",
  "Recognition",
  "Anniversary attendance",
  "Other",
] as const;
