import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export const metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Descriptive statistics only." />
      <PlaceholderPanel>
        Charts (see components/analytics) and rates by source / resume / month.
      </PlaceholderPanel>
    </>
  );
}
