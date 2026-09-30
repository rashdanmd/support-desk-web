import { expect, test } from "@playwright/test";

import { signInAs } from "../../support/auth";
import { stubSupportApi } from "../../support/api";
import { ticket } from "../../support/tickets";

test.skip(true, "Demo sign-in is not available in this environment.");

test("renders a ticket row", async ({ page }) => {
  await stubSupportApi(page, { tickets: [ticket()] });
  await signInAs(page, "user");

  const row = page.getByRole("listitem").filter({ hasText: "Login fails" });

  await expect(row).toContainText("The form returns 500");
  await expect(row).toContainText("Platform");
  await expect(row).toContainText("Ada");
  await expect(row).toContainText("15 Mar 2026");
  await expect(row).toContainText("High");
  await expect(row).toContainText("Pending");
});
