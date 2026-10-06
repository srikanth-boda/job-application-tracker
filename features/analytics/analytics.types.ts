import type { ApplicationSource } from "@/constants/application-sources";

/** Rates are 0..1, or null when the denominator is 0. Descriptive only. */
export interface AnalyticsSummary {
  applicationsOverTime: { date: string; count: number }[];
  responseRate: number | null;
  interviewRate: number | null;
  offerRate: number | null;
  rejectionRate: number | null;
  bySource: { source: ApplicationSource; count: number }[];
  byResume: { resumeId: string; count: number }[];
  byMonth: { month: string; count: number }[];
}
