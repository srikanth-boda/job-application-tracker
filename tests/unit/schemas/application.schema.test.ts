import { describe, expect, it } from "vitest";
import {
  changeApplicationStatusSchema,
  createApplicationSchema,
} from "@/schemas/application.schema";

describe("createApplicationSchema", () => {
  const valid = { company: "Acme", jobTitle: "Engineer", source: "linkedin" as const };

  it("accepts a minimal application and applies defaults", () => {
    const result = createApplicationSchema.parse(valid);
    expect(result.status).toBe("saved");
    expect(result.jobUrl).toBeNull();
    expect(result.resumeId).toBeNull();
  });

  it("keeps source and jobUrl as separate fields", () => {
    const result = createApplicationSchema.parse({
      ...valid,
      jobUrl: "https://example.com/jobs/1",
    });
    expect(result.source).toBe("linkedin");
    expect(result.jobUrl).toBe("https://example.com/jobs/1");
  });

  it("rejects missing company, unknown source and non-http URLs", () => {
    expect(createApplicationSchema.safeParse({ ...valid, company: " " }).success).toBe(false);
    expect(createApplicationSchema.safeParse({ ...valid, source: "facebook" }).success).toBe(false);
    expect(
      createApplicationSchema.safeParse({ ...valid, jobUrl: "javascript:alert(1)" }).success,
    ).toBe(false);
  });
});

describe("changeApplicationStatusSchema", () => {
  it("rejects unknown statuses", () => {
    expect(changeApplicationStatusSchema.safeParse({ status: "ghosted" }).success).toBe(false);
    expect(changeApplicationStatusSchema.safeParse({ status: "interview" }).success).toBe(true);
  });
});
