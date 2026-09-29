import { afterEach, describe, expect, it, vi } from "vitest";

import { getDemoCredentials, isDemoEnabled, isDemoRole } from "./demo";

describe("demo access", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("enables demo mode only for the exact true flag", () => {
    vi.stubEnv("DEMO_ENABLED", "true");
    expect(isDemoEnabled()).toBe(true);

    vi.stubEnv("DEMO_ENABLED", "false");
    expect(isDemoEnabled()).toBe(false);
  });

  it("accepts only the user and support roles", () => {
    expect(isDemoRole("user")).toBe(true);
    expect(isDemoRole("support")).toBe(true);
    expect(isDemoRole("admin")).toBe(false);
    expect(isDemoRole(null)).toBe(false);
  });

  it("returns credentials for the requested role", () => {
    vi.stubEnv("DEMO_USER_EMAIL", "user@example.com");
    vi.stubEnv("DEMO_USER_PASSWORD", "user-secret");
    vi.stubEnv("DEMO_SUPPORT_EMAIL", "support@example.com");
    vi.stubEnv("DEMO_SUPPORT_PASSWORD", "support-secret");

    expect(getDemoCredentials("user")).toEqual({
      email: "user@example.com",
      password: "user-secret",
    });
    expect(getDemoCredentials("support")).toEqual({
      email: "support@example.com",
      password: "support-secret",
    });
  });

  it("returns null when either credential is missing", () => {
    vi.stubEnv("DEMO_USER_EMAIL", "user@example.com");
    vi.stubEnv("DEMO_USER_PASSWORD", "");

    expect(getDemoCredentials("user")).toBeNull();
  });
});
