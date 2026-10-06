import { readFileSync } from "node:fs";
import path from "node:path";
import { initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";

const root = path.resolve(__dirname, "../../firebase");

export function createRulesTestEnv(projectId: string): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync(path.join(root, "firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
    storage: {
      rules: readFileSync(path.join(root, "storage.rules"), "utf8"),
      host: "127.0.0.1",
      port: 9199,
    },
  });
}

export const validApplication = (userId: string) => ({
  userId,
  company: "Acme",
  jobTitle: "Engineer",
  source: "linkedin",
  status: "saved",
  jobUrl: null,
  resumeId: null,
  jobDescriptionSnapshot: null,
  notes: null,
  appliedAt: null,
  jobDescriptionCapturedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});
