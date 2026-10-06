import type { InterviewOutcome } from "@/constants/interviews";
import type { IsoDateString, OwnedEntity } from "./common";

export interface Interview extends OwnedEntity {
  applicationId: string;
  roundNumber: number;
  roundName: string | null;
  scheduledAt: IsoDateString;
  /** IANA timezone, e.g. "Asia/Kolkata". */
  timezone: string;
  meetingUrl: string | null;
  interviewer: string | null;
  notes: string | null;
  outcome: InterviewOutcome;
}
