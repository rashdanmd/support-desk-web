import type { Page } from "@playwright/test";

import { stubSupportApi, type StubOptions } from "./api";
import { signInAs } from "./auth";

export const openSignedIn = async (
  page: Page,
  path: string,
  options: StubOptions = {},
) => {
  await stubSupportApi(page, options);
  await signInAs(page, options.role ?? "user");

  if (path !== "/") {
    await page.goto(path);
  }
};
