import { PageHeader } from "@/components/layout/page-header";
import { PaymentButton, PricingCard } from "@/components/payments";
import { PLANS } from "@/constants/plans";

export const metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <>
      <PageHeader title="Billing" description="Plans and payment history." />
      <div className="grid gap-4 md:grid-cols-2">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            action={
              plan.amount > 0 ? <PaymentButton label="Upgrade (coming soon)" disabled /> : undefined
            }
          />
        ))}
      </div>
    </>
  );
}
