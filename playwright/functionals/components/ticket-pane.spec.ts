import { expect, test } from "@playwright/test";

import { signInAs } from "../../support/auth";
import { stubSupportApi } from "../../support/api";
import { ticket } from "../../support/tickets";

test.skip(true, "Demo sign-in is not available in this environment.");

test("opens ticket details and closes them", async ({ page }) => {
  await stubSupportApi(page, { tickets: [ticket()] });
  await signInAs(page, "user");

  await page.getByRole("button", { name: /Login fails/ }).click();

  const dialog = page.getByRole("dialog", { name: "Ticket details" });

  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Login fails" })).toBeVisible();
  await expect(dialog.getByText("Ticket #4")).toBeVisible();
  await expect(dialog.getByText("No responses yet.")).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Edit ticket" })).toHaveAttribute(
    "href",
    "/tickets/4/edit",
  );

  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
  expect(new URL(page.url()).searchParams.get("ticket")).toBeNull();
});
