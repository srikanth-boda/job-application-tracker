import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/constants/application-statuses";
import { Badge } from "@/components/ui/badge";

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge>{APPLICATION_STATUS_LABELS[status]}</Badge>;
}
