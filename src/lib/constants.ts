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
  partnershipLine: "Tirngan leads the programme · ISEYC supports the registration system",
  tagline: "A trusted registration desk for attendance, recognition, and programme coordination",
  web: "https://www.iseyc.com.ng",
  email: "iseycglobal@gmail.com",
} as const;

export const PARTNER = {
  name: "Tirngan Sickle Cell Foundation",
  shortName: "Tirngan",
  tagline: "Breaking Cycles",
} as const;

export const SITE = {
  productName: "Programme Registration Desk",
  title: "Programme Registration Desk · Tirngan Sickle Cell Foundation",
  description:
    "Official registration desk for Tirngan Sickle Cell Foundation’s 5th Anniversary Dinner & Recognition Ceremony on 18 September 2026. Led by Tirngan, supported by ISEYC.",
  shortDescription:
    "Confirm your attendance and help the programme team prepare a smooth, dignified experience.",
  keywords: [
    "Tirngan Sickle Cell Foundation",
    "ISEYC",
    "Programme Registration Desk",
    "sickle cell Nigeria",
    "5th anniversary",
    "caregiver recognition",
    "RSVP",
    "Karji",
  ],
} as const;

export const COPY = {
  trustStrip:
    "We collect only the information needed to coordinate attendance and programme activities. Your response is treated as a programme record, not a medical record.",
  rsvpIntro:
    "Please complete this short form to confirm your place. It takes about one minute.",
  rsvpSuccessTitle: "Registration confirmed",
  rsvpSuccessBody:
    "Thank you. Your response has been recorded for the 18 September 2026 programme.",
  configBanner:
    "Registration is not connected to the programme database yet. Complete the system setup before accepting live responses.",
  footerOwner:
    "Tirngan Sickle Cell Foundation leads the programme. ISEYC provides the registration desk and supporting systems.",
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
