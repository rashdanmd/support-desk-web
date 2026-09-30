import { defineConfig } from "@playwright/test";

const port = 3000;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: true,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    channel: "chrome",
  },
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "functionals",
      testDir: "./playwright/functionals",
    },
    {
      name: "e2e",
      testDir: "./playwright/e2e",
    },
    {
      name: "smoke",
      testDir: "./playwright/smoke",
    },
  ],
});
