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

/**
 * Partnership model (do not over-claim ownership):
 * - Tirngan leads the programme and field work.
 * - ISEYC provides the Field Register Desk as systems support.
 * - Records serve programme integrity and recognition — not medical care.
 */
export const ORG = {
  name: "ISEYC",
  fullName: "Initiative for Sustainable Evolution for Youth and Community",
  supportLine: `In support of ${EVENT.programme}`,
  partnershipLine: "Programme led by Tirngan · Systems powered by ISEYC",
  tagline: "Community systems for participation, recognition, and integrity",
  web: "https://www.iseyc.com.ng",
  email: "iseycglobal@gmail.com",
} as const;

export const SITE = {
  productName: "Field Register Desk",
  title: "Field Register Desk · Tirngan × ISEYC",
  description:
    "Official register desk for Tirngan Sickle Cell Foundation — RSVP for the 5th Anniversary Dinner (18 September 2026) and ongoing programme participation records. Programme led by Tirngan. Systems powered by ISEYC. Not a medical record.",
  shortDescription:
    "RSVP and field participation records for Tirngan Sickle Cell Foundation. Powered by ISEYC.",
  keywords: [
    "Tirngan Sickle Cell Foundation",
    "ISEYC",
    "Field Register Desk",
    "sickle cell Nigeria",
    "5th anniversary dinner",
    "caregiver recognition",
    "genotype awareness",
    "community health register",
    "Karji",
    "programme participation",
  ],
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
