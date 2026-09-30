import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";

test("sends the tickets index to the board", async ({ page }) => {
  await openSignedIn(page, "/tickets");

  await expect(
    page.getByRole("heading", { name: "Support requests" }),
  ).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/");
});
