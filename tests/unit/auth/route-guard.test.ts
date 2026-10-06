import { describe, expect, it } from "vitest";
import { isAuthPath, isProtectedPath } from "@/lib/auth/route-guard";

describe("route guard", () => {
  it("protects app pages and their children", () => {
    for (const path of [
      "/dashboard",
      "/applications",
      "/applications/new",
      "/applications/abc",
      "/billing",
      "/settings",
    ]) {
      expect(isProtectedPath(path)).toBe(true);
    }
  });
  it("leaves public and auth pages open", () => {
    for (const path of ["/", "/login", "/register", "/forgot-password", "/dashboardx"]) {
      expect(isProtectedPath(path)).toBe(false);
    }
    expect(isAuthPath("/login")).toBe(true);
  });
});
