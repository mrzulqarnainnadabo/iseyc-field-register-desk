// Event facts + dual-organisation brand language.
// Keep select option names in sync with Notion databases.

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
 * Brand model (how serious organisations partner):
 * - Tirngan = programme owner (mission, caregivers, ceremony)
 * - ISEYC = systems partner (register desk, structure, integrity of records)
 * Never claim ISEYC runs the foundation or owns the data narrative.
 */
export const ORG = {
  name: "ISEYC",
  fullName: "Initiative for Sustainable Evolution for Youth and Community",
  motto: "Empowering Youth, Shaping Futures",
  supportLine: `In support of ${EVENT.programme}`,
  partnershipLine: "Programme led by Tirngan · Systems powered by ISEYC",
  tagline: "A shared register for participation, recognition, and care of records",
  web: "https://www.iseyc.com.ng",
  email: "iseycglobal@gmail.com",
} as const;

export const PARTNER = {
  name: "Tirngan Sickle Cell Foundation",
  shortName: "Tirngan",
  tagline: "Breaking Cycles",
} as const;

export const SITE = {
  productName: "Field Register Desk",
  title: "Field Register Desk · Tirngan Sickle Cell Foundation",
  description:
    "Official RSVP and programme participation register for Tirngan Sickle Cell Foundation’s 5th Anniversary Dinner & Recognition Ceremony (18 September 2026). Programme led by Tirngan. Register desk powered by ISEYC. Not a medical record.",
  shortDescription:
    "Confirm attendance and keep programme records with dignity. Led by Tirngan · Powered by ISEYC.",
  keywords: [
    "Tirngan Sickle Cell Foundation",
    "ISEYC",
    "Field Register Desk",
    "sickle cell Nigeria",
    "5th anniversary",
    "caregiver recognition",
    "RSVP",
    "Karji",
  ],
} as const;

export const COPY = {
  trustStrip:
    "Your details help the organising team plan seating, recognition, and follow-up. They are programme records only — not a medical file.",
  rsvpIntro:
    "Please confirm whether you will attend. This takes about a minute.",
  rsvpSuccessTitle: "You are on the list",
  rsvpSuccessBody:
    "Thank you. The organising team has your response for the 18 September ceremony.",
  configBanner:
    "This register is not linked to the programme database yet. Please complete setup before collecting live responses.",
  footerOwner:
    "Tirngan Sickle Cell Foundation leads this programme. ISEYC provides the Field Register Desk as systems support.",
  footerPrivacy: "Records held for programme integrity and recognition · Not a medical record",
} as const;

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
