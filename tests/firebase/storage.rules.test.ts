import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { ref, uploadBytes } from "firebase/storage";
import { afterAll, beforeAll, describe, it } from "vitest";
import { createRulesTestEnv } from "./rules.helpers";

let env: RulesTestEnvironment;
const pdf = new Uint8Array([37, 80, 68, 70]);

beforeAll(async () => {
  env = await createRulesTestEnv("demo-rules-storage");
});
afterAll(async () => env.cleanup());

describe("resume storage", () => {
  it("lets the owner upload a PDF once", async () => {
    const storage = env.authenticatedContext("alice").storage();
    await assertSucceeds(
      uploadBytes(ref(storage, "resumes/alice/r1.pdf"), pdf, { contentType: "application/pdf" }),
    );
    // overwrite is blocked: resume versions are immutable
    await assertFails(
      uploadBytes(ref(storage, "resumes/alice/r1.pdf"), pdf, { contentType: "application/pdf" }),
    );
  });

  it("rejects non-PDF content types", async () => {
    const storage = env.authenticatedContext("alice").storage();
    await assertFails(
      uploadBytes(ref(storage, "resumes/alice/r2.pdf"), pdf, { contentType: "image/png" }),
    );
  });

  it("rejects uploads into another user's folder and anonymous uploads", async () => {
    await assertFails(
      uploadBytes(ref(env.authenticatedContext("mallory").storage(), "resumes/alice/r3.pdf"), pdf, {
        contentType: "application/pdf",
      }),
    );
    await assertFails(
      uploadBytes(ref(env.unauthenticatedContext().storage(), "resumes/alice/r4.pdf"), pdf, {
        contentType: "application/pdf",
      }),
    );
  });
});
