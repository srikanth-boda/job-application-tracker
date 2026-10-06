import { z } from "zod";
import { INTERVIEW_OUTCOMES } from "@/constants/interviews";
import { httpUrlSchema, optionalText } from "./shared";

const ianaTimezone = z.string().refine((tz) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}, "Invalid timezone");

export const createInterviewSchema = z.object({
  applicationId: z.string().min(1),
  roundNumber: z.number().int().min(1).max(20),
  roundName: optionalText(100),
  scheduledAt: z.string().datetime({ offset: true }),
  timezone: ianaTimezone,
  meetingUrl: httpUrlSchema.nullable().default(null),
  interviewer: optionalText(200),
  notes: optionalText(10_000),
  outcome: z.enum(INTERVIEW_OUTCOMES).default("pending"),
});

export const updateInterviewSchema = createInterviewSchema.omit({ applicationId: true }).partial();

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
