import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";
import { ticket } from "../../support/tickets";

test("shows the edit ticket form", async ({ page }) => {
  await openSignedIn(page, "/tickets/4/edit", { tickets: [ticket()] });

  await expect(page.getByRole("heading", { name: "Edit ticket" })).toBeVisible();
  await expect(page.getByLabel("Title")).toHaveValue("Login fails");
});
