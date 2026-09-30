import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";
import { boardTickets } from "../../support/tickets";

test("shows the ticket board", async ({ page }) => {
  await openSignedIn(page, "/", { tickets: boardTickets() });

  await expect(
    page.getByRole("heading", { name: "Support requests" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
});
