import { expect, test } from "@playwright/test";

import { signInAs } from "../../support/auth";
import { stubSupportApi } from "../../support/api";

test.skip(true, "Demo sign-in is not available in this environment.");

test("confirms before creating a ticket", async ({ page }) => {
  const api = await stubSupportApi(page);
  await signInAs(page, "user");
  await page.goto("/tickets/new");

  await expect(
    page.getByRole("heading", { name: "Create a support request" }),
  ).toBeVisible();

  await page.getByLabel("Title").fill("Printer jam");
  await page.getByLabel("Team").selectOption("Platform");
  await page.getByLabel("Priority").selectOption("High");
  await page
    .getByLabel("Description")
    .fill("The printer on floor 2 is jammed.");

  await page.getByRole("button", { name: "Create ticket" }).click();
  const dialog = page.getByRole("dialog", { name: "Create this ticket?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByLabel("Title")).toHaveValue("Printer jam");

  await page.getByRole("button", { name: "Create ticket" }).click();
  await dialog.getByRole("button", { name: "Create ticket" }).click();

  await expect(
    page.getByRole("heading", { name: "Support requests" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Printer jam/ })).toBeVisible();
  expect(api.created).toEqual([
    {
      title: "Printer jam",
      description: "The printer on floor 2 is jammed.",
      teamId: 2,
      affectedUrl: "",
      curl: "",
      priority: "high",
    },
  ]);
});
