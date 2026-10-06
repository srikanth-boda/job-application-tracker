import { ApplicationForm } from "@/components/applications/application-form";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = { title: "New Application | JobTrack" };

export default function NewApplicationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <PageHeader
        title="Add New Application"
        description="Track a new job opportunity, interview cycle, and custom application metadata."
      />
      <ApplicationForm />
    </div>
  );
}
