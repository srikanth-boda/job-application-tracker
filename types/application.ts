import type { ApplicationSource } from "@/constants/application-sources";
import type { ApplicationStatus } from "@/constants/application-statuses";
import type { IsoDateString, OwnedEntity } from "./common";

/** Firestore: users/{userId}/applications/{id}. One application = one source of truth. */
export interface Application extends OwnedEntity {
  company: string;
  companyName?: string;
  jobTitle: string;
  appliedAt: IsoDateString | null;
  appliedDate?: unknown;
  source: ApplicationSource;
  /** Original posting URL. Stored separately from `source`. */
  jobUrl?: string | null;
  status: ApplicationStatus;
  /** Exact resume version used. References resumes/{resumeId}. */
  resumeId?: string | null;
  /** Job description text pasted by the user. No scraping. */
  location?: string | null;
  resumeName?: string | null;
  resumeUrl?: string | null;
  jobDescriptionSnapshot?: string | null;
  jobDescriptionCapturedAt?: IsoDateString | null;
  notes?: string | null;
}

/** Firestore: statusHistory/{id}. Append-only. */
export interface StatusHistoryEntry {
  id: string;
  userId: string;
  applicationId: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedAt: IsoDateString;
  note: string | null;
}

/** Derived from `status` - not stored, so there is a single source of truth. */
export type ApplicationOutcome = "pending" | "accepted" | "rejected" | "withdrawn";
