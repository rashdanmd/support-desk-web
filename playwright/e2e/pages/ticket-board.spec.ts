import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";
import { boardTickets } from "../../support/tickets";

test("filters the board down to one request", async ({ page }) => {
  await openSignedIn(page, "/", { tickets: boardTickets() });

  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Search is slow/ })).toBeVisible();

  await page.getByLabel("Status").selectOption("Pending");

  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Search is slow/ })).toHaveCount(0);
});
