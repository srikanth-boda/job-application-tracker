import {
  ACTIVE_APPLICATION_STATUSES,
  TERMINAL_APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/constants/application-statuses";
import type { ApplicationOutcome } from "@/types/application";

export const isActiveStatus = (status: ApplicationStatus): boolean =>
  ACTIVE_APPLICATION_STATUSES.includes(status);

export const isTerminalStatus = (status: ApplicationStatus): boolean =>
  TERMINAL_APPLICATION_STATUSES.includes(status);

/** Outcome is derived from status so there is one source of truth. */
export function getOutcome(status: ApplicationStatus): ApplicationOutcome {
  switch (status) {
    case "accepted":
      return "accepted";
    case "rejected":
      return "rejected";
    case "withdrawn":
      return "withdrawn";
    default:
      return "pending";
  }
}
