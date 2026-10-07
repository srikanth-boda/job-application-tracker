import { z } from "zod";
import { APPLICATION_SOURCES } from "@/constants/application-sources";
import { APPLICATION_STATUSES } from "@/constants/application-statuses";
import { httpUrlSchema, optionalText } from "./shared";

const baseApplicationFields = {
  company: z.string().trim().max(200).optional(),
  companyName: z.string().trim().max(200).optional(),
  jobTitle: z.string().trim().min(1, "Job title is required").max(200),
  appliedAt: z.string().nullable().optional().default(null),
  appliedDate: z.any().optional(),
  source: z.enum(APPLICATION_SOURCES),
  jobUrl: httpUrlSchema.nullable().optional().default(null),
  resumeId: z.string().min(1).nullable().optional().default(null),
  location: optionalText(200),
  workMode: optionalText(50),
  resumeName: optionalText(200),
  resumeUrl: optionalText(2048),
  jobDescriptionSnapshot: optionalText(50_000),
  notes: optionalText(10_000),
};

export const createApplicationSchema = z
  .object({
    ...baseApplicationFields,
    status: z.enum(APPLICATION_STATUSES).optional().default("saved"),
  })
  .superRefine((data, ctx) => {
    const hasCompany = Boolean(
      (data.company && data.company.trim().length > 0) ||
        (data.companyName && data.companyName.trim().length > 0),
    );
    if (!hasCompany) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Company is required",
        path: ["company"],
      });
    }
  });

/** Status changes go through `changeApplicationStatusSchema` so history is always recorded. */
export const updateApplicationSchema = z.object(baseApplicationFields).partial();

export const changeApplicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  note: optionalText(1000),
});

export type CreateApplicationInput = z.input<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.input<typeof updateApplicationSchema>;
export type ChangeApplicationStatusInput = z.infer<typeof changeApplicationStatusSchema>;
