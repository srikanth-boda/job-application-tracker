export const APPLICATION_STATUSES = [
  "saved",
  "applied",
  "recruiter_response",
  "screening",
  "interview",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  recruiter_response: "Recruiter Response",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

/** Applied and still in play. "saved" is not an application yet. */
export const ACTIVE_APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  "applied",
  "recruiter_response",
  "screening",
  "interview",
  "offer",
];

export const TERMINAL_APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  "accepted",
  "rejected",
  "withdrawn",
];
