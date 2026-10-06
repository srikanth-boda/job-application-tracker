import { z } from "zod";
import { ALLOWED_RESUME_MIME_TYPES, MAX_RESUME_SIZE_BYTES } from "@/constants/storage";

/** Validates the browser `File` metadata. Storage rules re-check type and size server-side. */
export const resumeFileSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(ALLOWED_RESUME_MIME_TYPES, { message: "Only PDF files are allowed" }),
  size: z
    .number()
    .int()
    .positive("File is empty")
    .max(MAX_RESUME_SIZE_BYTES, "File must be 5 MB or smaller"),
});

export const renameResumeSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
});

export type ResumeFileInput = z.infer<typeof resumeFileSchema>;
export type RenameResumeInput = z.infer<typeof renameResumeSchema>;
