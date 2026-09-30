import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";
import { ticket } from "../../support/tickets";

test("opens ticket details from the ticket page", async ({ page }) => {
  await openSignedIn(page, "/tickets/4", { tickets: [ticket()] });

  const dialog = page.getByRole("dialog", { name: "Ticket details" });

  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Login fails" })).toBeVisible();
  expect(new URL(page.url()).searchParams.get("ticket")).toBe("4");
});
