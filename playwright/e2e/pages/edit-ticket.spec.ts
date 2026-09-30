import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";
import { ticket } from "../../support/tickets";

test("saves a new title and returns to my tickets", async ({ page }) => {
  await openSignedIn(page, "/tickets/4/edit", { tickets: [ticket()] });

  await page.getByLabel("Title").fill("Login times out");
  await page.getByRole("button", { name: "Save changes" }).click();

  const dialog = page.getByRole("dialog", { name: "Save these changes?" });
  await dialog.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByRole("heading", { name: "My tickets" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Login times out/ }),
  ).toBeVisible();
});
