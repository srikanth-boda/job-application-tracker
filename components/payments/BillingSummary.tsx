import { Card } from "@/components/ui/card";
import type { Plan, Subscription } from "@/types/payment";

export function BillingSummary({
  plan,
  subscription,
}: {
  plan: Plan;
  subscription?: Subscription | null;
}) {
  return (
    <Card>
      <p className="text-sm text-slate-500">Current plan</p>
      <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
      {subscription?.expiresAt ? (
        <p className="mt-1 text-sm text-slate-600">
          Active until {new Date(subscription.expiresAt).toLocaleDateString("en-IN")}
        </p>
      ) : null}
    </Card>
  );
}
