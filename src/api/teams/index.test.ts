import { afterEach, describe, expect, it, vi } from "vitest";

import { getTeams } from "./index";

describe("getTeams", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns the team list", async () => {
    const teams = [{ id: 2, name: "Platform", description: null }];
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(teams)));

    await expect(getTeams()).resolves.toEqual(teams);
    expect(fetch).toHaveBeenCalledWith("https://api.example/api/teams");
  });

  it("throws when the team request fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    await expect(getTeams()).rejects.toThrow("Failed to get teams");
  });
});
