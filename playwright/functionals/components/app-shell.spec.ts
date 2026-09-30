import { expect, test } from "@playwright/test";

import { signInAs } from "../../support/auth";
import { stubSupportApi } from "../../support/api";

test.skip(true, "Demo sign-in is not available in this environment.");

test("navigates and asks before signing out", async ({ page }) => {
  await stubSupportApi(page);
  await signInAs(page, "user");

  await expect(page.getByRole("link", { name: "Tickets" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page.getByRole("link", { name: "My tickets" }).click();
  await expect(page.getByRole("heading", { name: "My tickets" })).toBeVisible();

  await page.getByRole("link", { name: "New ticket" }).click();
  await expect(
    page.getByRole("heading", { name: "Create a support request" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();

  const dialog = page.getByRole("dialog", { name: "Sign out?" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("You'll need to sign in again to view tickets."),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "Create a support request" }),
  ).toBeVisible();
});
