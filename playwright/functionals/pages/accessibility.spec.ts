import { expect, test } from "@playwright/test";

import { expectAccessible } from "../../support/a11y";

test("sign-in has no accessibility violations", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expectAccessible(page);
});

test("sign-up has no accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(
    page.getByRole("heading", { name: "Create an account" }),
  ).toBeVisible();
  await expectAccessible(page);
});

test("unavailable demo sign-in has no accessibility violations", async ({
  page,
}) => {
  await page.goto("/?demo=unavailable");

  await expect(
    page.getByRole("alert").filter({
      hasText: "Demo sign-in is not available right now.",
    }),
  ).toBeVisible();
  await expectAccessible(page);
});

test("account confirmation dialog has no accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Surname").fill("Lovelace");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password1");
  await page.getByLabel("Confirm password").fill("password1");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(
    page.getByRole("dialog", { name: "Create your account?" }),
  ).toBeVisible();
  await expectAccessible(page);
});
