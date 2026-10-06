import { z } from "zod";
import { TASK_PRIORITIES, TASK_TYPES } from "@/constants/tasks";

export const createTaskSchema = z.object({
  applicationId: z.string().min(1).nullable().default(null),
  type: z.enum(TASK_TYPES),
  title: z.string().trim().min(1, "Title is required").max(200),
  dueAt: z.string().datetime({ offset: true }).nullable().default(null),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
