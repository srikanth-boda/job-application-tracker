import type { TaskPriority, TaskType } from "@/constants/tasks";
import type { IsoDateString, OwnedEntity } from "./common";

export interface Task extends OwnedEntity {
  applicationId: string | null;
  type: TaskType;
  title: string;
  dueAt: IsoDateString | null;
  priority: TaskPriority;
  completed: boolean;
  completedAt: IsoDateString | null;
}
