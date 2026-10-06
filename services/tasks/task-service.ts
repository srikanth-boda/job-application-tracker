import { notImplemented } from "@/lib/errors";
import type { CreateTaskInput, UpdateTaskInput } from "@/schemas/task.schema";
import type { Task } from "@/types/task";

/** PLACEHOLDER data-access layer for tasks/{id}. */
export const taskService = {
  list: async (_userId: string): Promise<Task[]> => notImplemented("taskService.list"),
  listPending: async (_userId: string): Promise<Task[]> =>
    notImplemented("taskService.listPending"),
  create: async (_userId: string, _input: CreateTaskInput): Promise<Task> =>
    notImplemented("taskService.create"),
  update: async (_id: string, _input: UpdateTaskInput): Promise<void> =>
    notImplemented("taskService.update"),
};
