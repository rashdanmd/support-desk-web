import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";
import { boardTickets } from "../../support/tickets";

test("cancels one of my tickets", async ({ page }) => {
  await openSignedIn(page, "/my-tickets", { tickets: boardTickets() });

  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Search is slow/ })).toHaveCount(
    0,
  );

  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Cancel this ticket?" });
  await dialog.getByRole("button", { name: "Cancel ticket" }).click();

  await expect(page.getByText("Cancelled")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toHaveCount(0);
});
