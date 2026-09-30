import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";

test("creates a ticket and shows it on the board", async ({ page }) => {
  await openSignedIn(page, "/tickets/new");

  await page.getByLabel("Title").fill("Printer jam");
  await page.getByLabel("Team").selectOption("Platform");
  await page.getByLabel("Priority").selectOption("High");
  await page
    .getByLabel("Description")
    .fill("The printer on floor 2 is jammed.");
  await page.getByRole("button", { name: "Create ticket" }).click();

  const dialog = page.getByRole("dialog", { name: "Create this ticket?" });
  await dialog.getByRole("button", { name: "Create ticket" }).click();

  await expect(
    page.getByRole("heading", { name: "Support requests" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Printer jam/ })).toBeVisible();
});
