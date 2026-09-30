import { expect, test } from "@playwright/test";

import { signInAs } from "../../support/auth";
import { stubSupportApi } from "../../support/api";

test.skip(true, "Demo sign-in is not available in this environment.");

test("dismisses with escape and keeps the form", async ({ page }) => {
  await stubSupportApi(page);
  await signInAs(page, "user");
  await page.goto("/tickets/new");

  await page.getByLabel("Title").fill("Printer jam");
  await page.getByRole("button", { name: "Create ticket" }).click();

  const dialog = page.getByRole("dialog", { name: "Create this ticket?" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("This sends the request to the help team."),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByLabel("Title")).toHaveValue("Printer jam");
  expect(new URL(page.url()).pathname).toBe("/tickets/new");
});
