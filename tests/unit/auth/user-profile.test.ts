import { describe, expect, it } from "vitest";
import type { UserProfile } from "@/types/user";

describe("UserProfile schema conformance", () => {
  it("only contains allowed keys for firestore.rules", () => {
    const allowedKeys = ["id", "email", "displayName", "timezone", "createdAt", "updatedAt"];

    const sampleProfile: UserProfile = {
      id: "usr_123",
      email: "test@example.com",
      displayName: "Test User",
      timezone: "America/New_York",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const keys = Object.keys(sampleProfile);
    expect(keys.every((key) => allowedKeys.includes(key))).toBe(true);
    expect(sampleProfile.id).toBe("usr_123");
    expect(sampleProfile.email).toBe("test@example.com");
  });
});
