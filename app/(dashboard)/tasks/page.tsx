import { PageHeader } from "@/components/layout/page-header";
import { TaskListPlaceholder } from "@/components/tasks/task-list-placeholder";

export const metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <>
      <PageHeader title="Tasks" />
      <TaskListPlaceholder />
    </>
  );
}
