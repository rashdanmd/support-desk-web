import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";
import { boardTickets } from "../../support/tickets";

test("shows my tickets", async ({ page }) => {
  await openSignedIn(page, "/my-tickets", { tickets: boardTickets() });

  await expect(page.getByRole("heading", { name: "My tickets" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
});
