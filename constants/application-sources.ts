export const APPLICATION_SOURCES = [
  "linkedin",
  "naukri",
  "indeed",
  "company_portal",
  "referral",
  "recruiter",
  "internshala",
  "wellfound",
  "other",
] as const;

export type ApplicationSource = (typeof APPLICATION_SOURCES)[number];

export const APPLICATION_SOURCE_LABELS: Record<ApplicationSource, string> = {
  linkedin: "LinkedIn",
  naukri: "Naukri",
  indeed: "Indeed",
  company_portal: "Company Career Portal",
  referral: "Referral",
  recruiter: "Recruiter",
  internshala: "Internshala",
  wellfound: "Wellfound",
  other: "Other",
};
