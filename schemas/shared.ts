import { z } from "zod";

/** http(s) only - rejects javascript:, data:, etc. */
export const httpUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .url()
  .refine((value) => /^https?:\/\//i.test(value), "URL must start with http:// or https://");

export const optionalText = (max: number) =>
  z.string().trim().max(max).nullable().optional().default(null);
