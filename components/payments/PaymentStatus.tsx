import type { PaymentStatus as PaymentStatusValue } from "@/constants/payments";
import { Badge } from "@/components/ui/badge";

const LABELS: Record<PaymentStatusValue, string> = {
  pending: "Pending",
  verified: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export function PaymentStatus({ status }: { status: PaymentStatusValue }) {
  return <Badge data-status={status}>{LABELS[status]}</Badge>;
}
