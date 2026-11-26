export const GTG = {
  title: "From Girlhood to Greatness",
  edition: "Second Edition",
  theme: "Accepting My Greatness — From Becoming Her to Believing in Her.",
  organiser: "Empower with Hafsat",
  partner: "Baytal Rihaa",
  systemsPartner: "Initiative for Sustainable Evolution for Youth and Community (ISEYC)",
  date: "Sunday, 29 November 2026",
  time: "1:00 PM",
  venue: "Yakubu Hub, Surami Road, U/Rimi, Kaduna, Nigeria",
  audience: "Women aged 20 and above",
  eventName: "From Girlhood to Greatness — Second Edition",
} as const;
export const REGISTRATION_SOURCES = ["Instagram", "WhatsApp", "Facebook", "Friend or family", "Empower with Hafsat", "Baytal Rihaa", "ISEYC", "Other"] as const;
export const AGE_BANDS = ["20–25", "26–35", "36–45", "46+", "Prefer not to say"] as const;
export const WHAT_LANDED = ["Sisterhood and connection", "The speakers' stories", "Practical tools I can use", "Space to be heard", "Mental wellbeing conversations", "The atmosphere", "Other"] as const;
export const WHAT_NEXT = ["Follow-up gatherings", "A sisterhood / peer circle", "Practical skills workshops", "Mentorship", "Information on counselling services", "Other"] as const;

export function getPublicSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return "https://" + process.env.VERCEL_URL;
  return "https://girlhood-greatness-visual-preview.vercel.app";
}
