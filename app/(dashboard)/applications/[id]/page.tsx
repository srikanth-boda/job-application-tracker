import { InterviewListPlaceholder } from "@/components/interviews/interview-list-placeholder";
import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";
import { TaskListPlaceholder } from "@/components/tasks/task-list-placeholder";

export const metadata = { title: "Application" };

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <PageHeader title="Application" description={`ID: ${id}`} />
      <div className="grid gap-4">
        <PlaceholderPanel>
          Details, status + history timeline, resume used, job description snapshot, notes.
        </PlaceholderPanel>
        <InterviewListPlaceholder />
        <TaskListPlaceholder />
      </div>
    </>
  );
}
