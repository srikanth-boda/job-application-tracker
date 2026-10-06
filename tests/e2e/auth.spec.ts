import { expect, test } from "@playwright/test";

test.describe("protected routes", () => {
  for (const path of ["/dashboard", "/applications", "/billing"]) {
    test(`${path} redirects anonymous users to /login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login/);
    });
  }

  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
  });

  test.fixme("a signed-in user can reach the dashboard (needs Auth emulator seeding)", async () => {});
});
