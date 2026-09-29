import { afterEach, describe, expect, it, vi } from "vitest";

const getSession = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getSession },
  }),
}));

import { getCurrentUser } from "./index";

const currentUser = {
  id: "user-1",
  email: "ada@company.com",
  role: "support" as const,
};

describe("getCurrentUser", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("requests the current user with the session token", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    getSession.mockResolvedValue({
      data: { session: { access_token: "token-1" } },
      error: null,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json(currentUser)),
    );

    await expect(getCurrentUser()).resolves.toEqual(currentUser);
    expect(fetch).toHaveBeenCalledWith("https://api.example/api/users/me", {
      headers: { Authorization: "Bearer token-1" },
    });
  });

  it("throws when the profile request fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    getSession.mockResolvedValue({
      data: { session: { access_token: "token-1" } },
      error: null,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    await expect(getCurrentUser()).rejects.toThrow("Failed to get current user");
  });
});
