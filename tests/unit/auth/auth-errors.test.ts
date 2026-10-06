import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "@/lib/auth/auth-errors";

describe("getAuthErrorMessage", () => {
  it("translates common Firebase authentication errors", () => {
    expect(getAuthErrorMessage({ code: "auth/invalid-credential" })).toContain("Invalid email or password");
    expect(getAuthErrorMessage({ code: "auth/user-not-found" })).toContain("Invalid email or password");
    expect(getAuthErrorMessage({ code: "auth/wrong-password" })).toContain("Invalid email or password");
    expect(getAuthErrorMessage({ code: "auth/email-already-in-use" })).toContain("already exists");
    expect(getAuthErrorMessage({ code: "auth/weak-password" })).toContain("at least 8 characters");
    expect(getAuthErrorMessage({ code: "auth/popup-closed-by-user" })).toContain("cancelled");
    expect(getAuthErrorMessage({ code: "auth/network-request-failed" })).toContain("Network error");
  });

  it("handles unexpected errors gracefully", () => {
    expect(getAuthErrorMessage(null)).toBe("An unexpected error occurred. Please try again.");
    expect(getAuthErrorMessage(undefined)).toBe("An unexpected error occurred. Please try again.");
    expect(getAuthErrorMessage("string error")).toBe("An unexpected error occurred. Please try again.");
  });
});
