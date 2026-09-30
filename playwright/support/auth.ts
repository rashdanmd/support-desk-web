import { expect, type Page } from "@playwright/test";

export const signInAs = async (page: Page, role: "user" | "support") => {
  const label = role === "user" ? "Explore as user" : "Explore as support";
  const board = page.getByRole("heading", { name: "Support requests" });
  const unavailable = page.getByRole("alert");

  await page.goto("/");
  await page.getByRole("button", { name: label }).click();
  await expect(board.or(unavailable)).toBeVisible({ timeout: 20_000 });

  if (await unavailable.isVisible()) {
    throw new Error(
      "Demo sign-in is not available. Check DEMO_ENABLED and the demo user credentials.",
    );
  }
};
