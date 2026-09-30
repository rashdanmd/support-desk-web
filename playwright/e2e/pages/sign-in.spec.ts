import { expect, test } from "@playwright/test";

import { signInAs } from "../../support/auth";

test("signs in with the demo user and reaches the board", async ({ page }) => {
  await signInAs(page, "user");

  await expect(
    page.getByRole("heading", { name: "Support requests" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Tickets", exact: true }),
  ).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("asks for an email and password on the sign-in page", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Please enter a valid email address")).toBeVisible();
  await expect(page.getByText("Please enter a valid password")).toBeVisible();
});
