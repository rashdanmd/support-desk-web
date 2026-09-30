import { expect, test } from "@playwright/test";

import { openSignedIn } from "../../support/session";
import { ticket } from "../../support/tickets";

test("opens a ticket from its page and closes the details", async ({
  page,
}) => {
  await openSignedIn(page, "/tickets/4", { tickets: [ticket()] });

  const dialog = page.getByRole("dialog", { name: "Ticket details" });

  await expect(dialog.getByText("The form returns 500")).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();

  await expect(dialog).toBeHidden();
  expect(new URL(page.url()).searchParams.get("ticket")).toBeNull();
});