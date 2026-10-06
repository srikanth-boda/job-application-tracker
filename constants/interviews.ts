export const INTERVIEW_OUTCOMES = ["pending", "passed", "failed", "cancelled"] as const;
export type InterviewOutcome = (typeof INTERVIEW_OUTCOMES)[number];
