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
  founder: "Miracle Sim Danjuma",
  founderTitle: "Founder",
} as const;

export const STEWARDSHIP = {
  dataOwner: "Tirngan Sickle Cell Foundation",
  dataSteward: "Miracle Sim Danjuma",
  stewardTitle: "Founder, Tirngan Sickle Cell Foundation",
  purpose:
    "Community responses collected through this desk are programme intelligence for Tirngan Sickle Cell Foundation and its partners. They exist to guide priorities, strengthen proposals, and improve support for warriors and caregivers.",
  accessNote:
    "Founder-level access is provided through the Evidence Brief. Operational field collection is managed by trained staff under institutional oversight.",
  formalStatement:
    "Information collected through the ISEYC × Tirngan Community Outreach Intelligence Desk is collected for defined community outreach, programme planning and evidence-generation purposes. Data collection follows principles of purpose limitation, data minimisation, responsible access and appropriate confidentiality. The platform is not intended to create clinical records or collect medical diagnoses. Information is analysed primarily in aggregate to identify community-level barriers, needs and programme priorities. Where personal information is collected for an expressly stated programme purpose, it should be handled only for that purpose and in accordance with applicable data-protection requirements and approved organisational procedures.",
} as const;

export const SITE = {
  productName: "ISEYC × TIRNGAN Community Outreach Intelligence Desk",
  title: "ISEYC × TIRNGAN · Community Outreach Intelligence Desk",
  description:
    "Privacy-first field data platform for capturing structured community outreach information and generating programme intelligence for ISEYC × Tirngan Sickle Cell Foundation under the leadership of Miracle Sim Danjuma.",
  shortDescription:
    "Capture structured community barriers, knowledge and support needs during outreach. Generate evidence for programme priorities.",
  keywords: [
    "ISEYC",
    "Tirngan Sickle Cell Foundation",
    "Miracle Sim Danjuma",
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
    "ISEYC × Tirngan · Purpose-led data collection · Privacy-conscious · Community-focused",
  consentIntro:
    "We are collecting this information to understand community barriers and improve future programmes. You may choose not to answer any question. This desk does not collect clinical diagnoses or create medical records.",
  configBanner:
    "The desk is temporarily unavailable because the programme database is not connected. Please complete the system setup before accepting live responses.",
  footerOwner:
    "Programme intelligence under the stewardship of Miracle Sim Danjuma, Founder, Tirngan Sickle Cell Foundation · Built in partnership with ISEYC.",
  footerPrivacy: "Programme records only · No medical diagnoses or clinical information is requested",
  offlineBanner: "Offline · Responses are being saved securely on this device",
  syncingBanner: "Syncing responses…",
  syncedBanner: "All responses synced",
  saveSuccess: "Response saved successfully. Ready for the next person.",
  emptyInsightsTitle: "No outreach evidence yet",
  emptyInsightsBody:
    "Insights will appear here once community responses have been collected. Start an outreach session to begin building the evidence base.",
  emptySessionsBody: "No outreach sessions yet. Start one above to begin collecting community evidence.",
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

// Legacy (migration safety)
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
