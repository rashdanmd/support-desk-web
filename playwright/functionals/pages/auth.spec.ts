import { expect, test } from "@playwright/test";

test.skip("shows the sign-in form and switches to sign-up", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Please enter a valid email address")).toBeVisible();
  await expect(page.getByText("Please enter a valid password")).toBeVisible();

  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an account" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Please enter your first name")).toBeVisible();
  await expect(page.getByText("Please enter your surname")).toBeVisible();
  await expect(page.getByText("Please confirm your password")).toBeVisible();

  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("sends signed-out visitors back to sign-in", async ({ page }) => {
  await page.goto("/my-tickets");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/");

  await page.goto("/tickets/new");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/");
});
