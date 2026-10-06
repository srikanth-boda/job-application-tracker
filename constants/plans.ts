import type { Plan } from "@/types/payment";

export const PLAN_IDS = ["free", "premium"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

/**
 * Source of truth for plans and prices. The server always reads the amount from here
 * (never from the client request). Amounts are in the smallest currency unit (paise).
 * Prices below are PLACEHOLDERS.
 */
export const PLANS: readonly Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Everything you need to start tracking applications.",
    amount: 0,
    currency: "INR",
    accessDurationDays: null,
    features: ["Unlimited applications", "Resume vault (limited)", "Dashboard"],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Advanced analytics and a bigger resume vault.",
    amount: 99900,
    currency: "INR",
    accessDurationDays: 365,
    features: ["Everything in Free", "Full analytics", "Unlimited resume versions"],
  },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((plan) => plan.id === id);
}
