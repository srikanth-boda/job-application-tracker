import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import type { Plan } from "@/types/payment";
import { formatCurrency } from "@/utils/currency";

/** Price + plan summary with a slot for the call-to-action (e.g. <PaymentButton />). */
export function PricingCard({ plan, action }: { plan: Plan; action?: ReactNode }) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="font-semibold text-slate-900">{plan.name}</h3>
      <p className="text-3xl font-semibold text-slate-900">
        {plan.amount === 0 ? "Free" : formatCurrency(plan.amount, plan.currency)}
      </p>
      <p className="text-sm text-slate-600">{plan.description}</p>
      {action}
    </Card>
  );
}
