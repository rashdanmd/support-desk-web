import { afterEach, describe, expect, it, vi } from "vitest";

const getSession = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getSession },
  }),
}));

import { getTickets } from "./ticket-service";

describe("ticket service", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns tickets for an authenticated session", async () => {
    const tickets = [{ id: 4, title: "Login fails" }];
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    getSession.mockResolvedValue({
      data: { session: { access_token: "token-1" } },
      error: null,
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(tickets)));

    await expect(getTickets()).resolves.toEqual(tickets);
    expect(fetch).toHaveBeenCalledWith("https://api.example/api/tickets", {
      headers: { Authorization: "Bearer token-1" },
    });
  });

  it("rejects when the user is not authenticated", async () => {
    getSession.mockResolvedValue({ data: { session: null }, error: null });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getTickets()).rejects.toThrow("User is not authenticated");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws when the ticket request fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    getSession.mockResolvedValue({
      data: { session: { access_token: "token-1" } },
      error: null,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    await expect(getTickets()).rejects.toThrow("Failed to get tickets");
  });
});
