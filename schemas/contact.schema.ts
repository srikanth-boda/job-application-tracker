import { z } from "zod";
import { httpUrlSchema, optionalText } from "./shared";

export const createContactSchema = z.object({
  applicationId: z.string().min(1).nullable().default(null),
  name: z.string().trim().min(1, "Name is required").max(200),
  role: optionalText(200),
  email: z.string().trim().email().max(320).nullable().default(null),
  phone: optionalText(30),
  linkedinUrl: httpUrlSchema.nullable().default(null),
  notes: optionalText(10_000),
});

export const updateContactSchema = createContactSchema.partial();

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
