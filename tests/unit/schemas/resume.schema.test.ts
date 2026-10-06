import { describe, expect, it } from "vitest";
import { MAX_RESUME_SIZE_BYTES } from "@/constants/storage";
import { resumeFileSchema } from "@/schemas/resume.schema";
import { buildResumeStoragePath } from "@/services/resumes/resume-storage-path";

describe("resumeFileSchema", () => {
  const pdf = { name: "cv.pdf", type: "application/pdf", size: 1024 };

  it("accepts a small PDF", () => {
    expect(resumeFileSchema.safeParse(pdf).success).toBe(true);
  });
  it("rejects non-PDF files", () => {
    expect(resumeFileSchema.safeParse({ ...pdf, type: "image/png" }).success).toBe(false);
  });
  it("rejects empty and oversized files", () => {
    expect(resumeFileSchema.safeParse({ ...pdf, size: 0 }).success).toBe(false);
    expect(resumeFileSchema.safeParse({ ...pdf, size: MAX_RESUME_SIZE_BYTES + 1 }).success).toBe(
      false,
    );
  });
});

describe("buildResumeStoragePath", () => {
  it("matches the path enforced by storage.rules", () => {
    expect(buildResumeStoragePath("u1", "r1")).toBe("resumes/u1/r1.pdf");
  });
});
