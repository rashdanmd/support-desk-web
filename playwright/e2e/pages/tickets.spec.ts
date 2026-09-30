import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";
import { boardTickets } from "../../support/tickets";

test("opens the board from the tickets index", async ({ page }) => {
  await openSignedIn(page, "/tickets", { tickets: boardTickets() });

  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Search is slow/ })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/");
});
