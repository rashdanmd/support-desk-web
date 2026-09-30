import { expect, test } from "@playwright/test";

import { signInAs } from "../../support/auth";
import { stubSupportApi } from "../../support/api";
import { boardTickets } from "../../support/tickets";

test.skip(true, "Demo sign-in is not available in this environment.");

test("filters the ticket board", async ({ page }) => {
  await stubSupportApi(page, { tickets: boardTickets() });
  await signInAs(page, "user");

  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Search is slow/ })).toBeVisible();
  await expect(page.getByLabel("Support request summary")).toHaveCount(0);

  await page.getByLabel("Status").selectOption("Pending");
  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Search is slow/ })).toHaveCount(0);

  await page.getByRole("button", { name: "Clear" }).click();
  await page.getByLabel("Search support requests").fill("slow");
  await expect(page.getByRole("button", { name: /Search is slow/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Login fails/ })).toHaveCount(0);
});

test("shows an empty board", async ({ page }) => {
  await stubSupportApi(page);
  await signInAs(page, "user");

  await expect(page.getByText("No tickets yet.")).toBeVisible();
  await expect(page.getByLabel("Status")).toHaveCount(0);
});

test("shows support summary counts", async ({ page }) => {
  await stubSupportApi(page, { tickets: boardTickets(), role: "support" });
  await signInAs(page, "support");

  const summary = page.getByLabel("Support request summary");

  await expect(summary.getByRole("button", { name: /Pending/ })).toContainText("1");
  await expect(summary.getByRole("button", { name: /In review/ })).toContainText(
    "1",
  );
  await expect(summary.getByRole("button", { name: /Total/ })).toContainText("2");

  await summary.getByRole("button", { name: /Pending/ }).click();
  await expect(page.getByRole("button", { name: /Login fails/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Search is slow/ })).toHaveCount(0);
});
