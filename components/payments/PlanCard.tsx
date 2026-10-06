import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Plan } from "@/types/payment";

/** Compact plan description. Presentational only. */
export function PlanCard({ plan, current = false }: { plan: Plan; current?: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{plan.name}</h3>
        {current ? <span className="text-xs font-medium text-indigo-600">Current plan</span> : null}
      </div>
      <p className="mt-1 text-sm text-slate-600">{plan.description}</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-700">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>
    </Card>
  );
}
