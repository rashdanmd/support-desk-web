import { afterEach, describe, expect, it, vi } from "vitest";

const getSession = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getSession },
  }),
}));

import { createTicketResponse, getTicketResponses } from "./index";

const ticketResponse = {
  id: 9,
  ticket_id: 4,
  user_id: "user-1",
  message: "Looking into this",
  created_at: "2026-03-15T14:05:00.000Z",
  updated_at: "2026-03-15T14:05:00.000Z",
  author: { id: "user-1", display_name: "Ada" },
};

describe("ticket responses API", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("loads responses for a ticket", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    getSession.mockResolvedValue({
      data: { session: { access_token: "token-1" } },
      error: null,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json([ticketResponse])),
    );

    await expect(getTicketResponses(4)).resolves.toEqual([ticketResponse]);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example/api/tickets/4/responses",
      { headers: { Authorization: "Bearer token-1" } },
    );
  });

  it("posts a new response", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    getSession.mockResolvedValue({
      data: { session: { access_token: "token-1" } },
      error: null,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json(ticketResponse)),
    );

    await expect(
      createTicketResponse(4, { message: "Looking into this" }),
    ).resolves.toEqual(ticketResponse);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example/api/tickets/4/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-1",
        },
        body: JSON.stringify({ message: "Looking into this" }),
      },
    );
  });

  it("throws when a response request fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    getSession.mockResolvedValue({
      data: { session: { access_token: "token-1" } },
      error: null,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 400 })),
    );

    await expect(getTicketResponses(4)).rejects.toThrow(
      "Failed to get ticket responses",
    );
    await expect(
      createTicketResponse(4, { message: "Hello" }),
    ).rejects.toThrow("Failed to create ticket response");
  });
});
