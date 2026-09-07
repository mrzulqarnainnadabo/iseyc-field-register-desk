// Event facts + joint-organisation brand language.
// Keep select option names in sync with Notion databases.

export const EVENT = {
  programme: "ISEYC × TIRNGAN",
  name: "5th Anniversary Dinner & Recognition Ceremony",
  theme: "Five years of breaking cycles, recognising resilience, and building a stronger future.",
  date: "Friday, 18 September 2026",
  isoCutoff: "2026-09-18T23:59:59+01:00",
  redCarpet: "4:00 PM",
  dinner: "5:00 PM Prompt",
  venue: "LIMCEEG Multipurpose Event Centre, Karji, Yakowa Express Way",
} as const;

export const ORG = {
  name: "ISEYC × TIRNGAN",
  fullName: "Initiative for Sustainable Evolution for Youth and Community × Tirngan Sickle Cell Foundation",
  motto: "Joint Registration Desk",
  supportLine: "A joint registration experience by ISEYC and Tirngan Sickle Cell Foundation",
  partnershipLine: "ISEYC × TIRNGAN · Joint Registration Desk",
  tagline: "A clear, trusted registration experience for attendance and programme coordination.",
  web: "https://www.iseyc.com.ng",
  email: "iseycglobal@gmail.com",
} as const;

export const PARTNER = {
  name: "Tirngan Sickle Cell Foundation",
  shortName: "TIRNGAN",
  tagline: "Breaking Cycles",
} as const;

export const SITE = {
  productName: "ISEYC × TIRNGAN Joint Registration Desk",
  title: "ISEYC × TIRNGAN · 5th Anniversary Dinner & Recognition Ceremony",
  description:
    "Joint registration desk for ISEYC × TIRNGAN’s 5th Anniversary Dinner & Recognition Ceremony on 18 September 2026.",
  shortDescription:
    "Reserve your place for an evening celebrating five years of resilience, service, and community impact.",
  keywords: [
    "ISEYC",
    "Tirngan Sickle Cell Foundation",
    "ISEYC × TIRNGAN",
    "Joint Registration Desk",
    "5th anniversary",
    "sickle cell Nigeria",
    "caregiver recognition",
    "RSVP",
    "Karji",
  ],
} as const;

export const COPY = {
  trustStrip:
    "Your details are used only to coordinate attendance and programme arrangements. This registration desk does not request or store medical information.",
  rsvpIntro:
    "Reserve your place by completing the short registration below. It takes about one minute.",
  rsvpSuccessTitle: "You’re registered",
  rsvpSuccessBody:
    "Thank you. Your place has been recorded for the 18 September 2026 programme. We look forward to welcoming you.",
  configBanner:
    "Registration is temporarily unavailable because the programme database is not connected. Please complete the system setup before accepting live responses.",
  footerOwner:
    "ISEYC × TIRNGAN presents this joint registration desk for the 5th Anniversary Dinner & Recognition Ceremony.",
  footerPrivacy: "Programme records only · No medical information is requested by this registration desk",
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
