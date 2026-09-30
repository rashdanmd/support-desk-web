import { expect, test } from "@playwright/test";

import { signInAs } from "../../support/auth";
import { stubSupportApi } from "../../support/api";
import { boardTickets } from "../../support/tickets";

test.skip(true, "Demo sign-in is not available in this environment.");

test("lists only the signed-in user's tickets and can cancel one", async ({
  page,
}) => {
  await stubSupportApi(page, { tickets: boardTickets() });
  await signInAs(page, "user");
  await page.goto("/my-tickets");

  await expect(page.getByRole("heading", { name: "My tickets" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Search is slow/ })).toHaveCount(
    0,
  );
  await expect(page.getByRole("link", { name: "Edit" })).toHaveAttribute(
    "href",
    "/tickets/4/edit",
  );

  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Cancel this ticket?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Keep ticket" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Pending")).toBeVisible();

  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await dialog.getByRole("button", { name: "Cancel ticket" }).click();
  await expect(page.getByText("Cancelled")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toHaveCount(0);
});
