import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";

test("shows the create ticket form", async ({ page }) => {
  await openSignedIn(page, "/tickets/new");

  await expect(
    page.getByRole("heading", { name: "Create a support request" }),
  ).toBeVisible();
  await expect(page.getByLabel("Title")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create ticket" })).toBeVisible();
});
