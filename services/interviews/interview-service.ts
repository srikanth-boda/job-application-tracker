import { notImplemented } from "@/lib/errors";
import type { CreateInterviewInput, UpdateInterviewInput } from "@/schemas/interview.schema";
import type { Interview } from "@/types/interview";

/** PLACEHOLDER data-access layer for interviews/{id}. */
export const interviewService = {
  listByApplication: async (_applicationId: string): Promise<Interview[]> =>
    notImplemented("interviewService.listByApplication"),
  listUpcoming: async (_userId: string, _limit: number): Promise<Interview[]> =>
    notImplemented("interviewService.listUpcoming"),
  create: async (_userId: string, _input: CreateInterviewInput): Promise<Interview> =>
    notImplemented("interviewService.create"),
  update: async (_id: string, _input: UpdateInterviewInput): Promise<void> =>
    notImplemented("interviewService.update"),
};
