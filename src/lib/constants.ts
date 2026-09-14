// ISEYC × TIRNGAN Community Outreach Intelligence Desk
// Institutional brand language + programme data dictionaries.
// Keep select option names in sync with Notion databases.

export const ORG = {
  name: "ISEYC × TIRNGAN",
  fullName: "Initiative for Sustainable Evolution for Youth and Community × Tirngan Sickle Cell Foundation",
  motto: "Community Outreach Intelligence Desk",
  supportLine: "A joint community evidence platform by ISEYC and Tirngan Sickle Cell Foundation",
  partnershipLine: "ISEYC × TIRNGAN · Community Outreach Intelligence Desk",
  tagline: "Structured community data for better programme decisions.",
  web: "https://www.iseyc.com.ng",
  email: "iseycglobal@gmail.com",
} as const;

export const PARTNER = {
  name: "Tirngan Sickle Cell Foundation",
  shortName: "TIRNGAN",
  tagline: "Breaking Cycles",
} as const;

export const SITE = {
  productName: "ISEYC × TIRNGAN Community Outreach Intelligence Desk",
  title: "ISEYC × TIRNGAN · Community Outreach Intelligence Desk",
  description:
    "Privacy-first field data platform for capturing structured community outreach information and generating programme intelligence for ISEYC × Tirngan Sickle Cell Foundation.",
  shortDescription:
    "Capture structured community barriers, knowledge and support needs during outreach. Generate evidence for programme priorities.",
  keywords: [
    "ISEYC",
    "Tirngan Sickle Cell Foundation",
    "ISEYC × TIRNGAN",
    "Community Outreach Intelligence",
    "sickle cell Nigeria",
    "community data",
    "health equity",
    "field data collection",
    "programme intelligence",
  ],
} as const;

export const COPY = {
  trustStrip:
    "Your responses help us understand community barriers and improve programmes. This desk does not collect medical diagnoses or clinical records.",
  consentIntro:
    "ISEYC and Tirngan Sickle Cell Foundation collect community information to understand barriers to health information, access and support, and to improve future programmes. We do not use this form as a medical record. Your responses will be analysed mainly in aggregate. You may choose not to answer individual questions.",
  configBanner:
    "The desk is temporarily unavailable because the programme database is not connected. Please complete the system setup before accepting live responses.",
  footerOwner:
    "ISEYC × TIRNGAN presents this Community Outreach Intelligence Desk for structured field data collection and programme evidence.",
  footerPrivacy: "Programme records only · No medical diagnoses or clinical information is requested",
  offlineBanner: "Offline · Responses are being saved securely on this device",
  syncingBanner: "Syncing responses…",
  syncedBanner: "All responses synced",
} as const;

// ---------- Outreach Session dictionaries ----------

export const PROGRAMMES = [
  "SCD Outreach",
  "Awareness Campaign",
  "Screening Referral",
  "Caregiver Session",
  "School / Hospital Visit",
  "Community Meeting",
  "Other",
] as const;

export const OUTREACH_TYPES = [
  "Community meeting",
  "Household outreach",
  "School visit",
  "Facility visit",
  "Campaign",
  "Other",
] as const;

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

// ---------- Community Response dictionaries ----------

export const PARTICIPANT_GROUPS = [
  "Warrior",
  "Caregiver",
  "Family member",
  "Community member",
  "Health worker",
  "Other",
] as const;

export const AGE_BANDS = [
  "Under 12",
  "12–17",
  "18–24",
  "25–34",
  "35–44",
  "45+",
  "Prefer not to say",
] as const;

export const SEX_OPTIONS = [
  "Female",
  "Male",
  "Other",
  "Prefer not to say",
] as const;

export const RESIDENCE_OPTIONS = [
  "Same community",
  "Other community",
] as const;

// Access & Affordability
export const MEDICATION_ACCESS = [
  "Usually easy",
  "Sometimes difficult",
  "Often difficult",
  "Very difficult / unavailable",
  "Not applicable",
  "Prefer not to answer",
] as const;

export const MEDICATION_AFFORDABILITY = [
  "Affordable",
  "Sometimes difficult to afford",
  "Usually unaffordable",
  "Completely unaffordable",
  "Not applicable",
  "Prefer not to answer",
] as const;

export const INVESTIGATION_ACCESS = [
  "Easy",
  "Some difficulty",
  "Difficult",
  "Very difficult",
  "Not applicable",
  "Prefer not to answer",
] as const;

export const INVESTIGATION_AFFORDABILITY = [
  "Affordable",
  "Sometimes difficult",
  "Usually unaffordable",
  "Completely unaffordable",
  "Not applicable",
  "Prefer not to answer",
] as const;

export const TRAVEL_TIME = [
  "Under 30 minutes",
  "30–60 minutes",
  "1–2 hours",
  "More than 2 hours",
  "No regular facility",
] as const;

export const TRANSPORT_BARRIER = [
  "No significant barrier",
  "Minor barrier",
  "Major barrier",
] as const;

export const FACILITY_AVAILABILITY = [
  "Usually",
  "Sometimes",
  "Rarely",
  "Don’t know",
  "Not applicable",
] as const;

// Knowledge & Awareness
export const GENOTYPE_KNOWLEDGE = [
  "Yes",
  "No",
  "Not sure",
  "Prefer not to answer",
] as const;

export const UNDERSTANDING_OPTIONS = [
  "Yes",
  "Partly",
  "No",
  "Not sure",
] as const;

export const YES_NO_NOTSURE = [
  "Yes",
  "No",
  "Not sure",
] as const;

// Barriers (multi-select)
export const MAIN_BARRIERS = [
  "Cost of medication",
  "Medication unavailable",
  "Cost of investigations",
  "Investigation unavailable",
  "Distance to facility",
  "Transport cost",
  "Long waiting time",
  "Lack of information",
  "Lack of awareness",
  "Stigma",
  "Caregiver constraints",
  "Work/school constraints",
  "Lack of insurance/support",
  "Communication problems",
  "Other",
] as const;

// Programme Need (multi-select)
export const SUPPORT_NEEDED = [
  "Health education",
  "Genotype education/testing referral",
  "Medication-access support",
  "Investigation support",
  "Facility navigation",
  "Counselling/psychosocial support",
  "Caregiver support",
  "Peer/community support",
  "Government programme information",
  "Insurance/financial support information",
  "Other",
  "No immediate support requested",
] as const;

// Legacy (kept temporarily for migration safety — will be removed in Deploy 3)
export const ACTIVITY_TYPES = [
  "Genotype testing",
  "Medication support",
  "Counseling",
  "Community outreach",
  "School/hospital visit",
  "Caregiver session",
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
  "Other",
] as const;
