import { expect, test } from "@playwright/test";

test("offers both demo roles", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("button", { name: "Explore as user" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explore as support" }),
  ).toBeVisible();
  await expect(page.getByText("No account or password required.")).toBeVisible();
});

test("explains when demo sign-in is unavailable", async ({ page }) => {
  await page.goto("/?demo=unavailable");

  await expect(
    page.getByRole("alert").filter({
      hasText: "Demo sign-in is not available right now.",
    }),
  ).toBeVisible();
});
