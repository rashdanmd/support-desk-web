import { afterEach, describe, expect, it, vi } from "vitest";

const getSession = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getSession },
  }),
}));

import {
  cancelTicket,
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  referTicket,
  resolveTicket,
  startTicketReview,
  updateTicket,
} from "./index";

const ticket = {
  id: 4,
  title: "Login fails",
  description: "The form returns 500",
  team_id: 2,
  affected_url: null,
  curl: null,
  priority: "high" as const,
  status: "pending" as const,
  created_by: "user-1",
  assigned_to: null,
  resolution: null,
  referred_to: null,
  referral_message: null,
  created_at: "2026-03-15T14:05:00.000Z",
  updated_at: "2026-03-15T14:05:00.000Z",
  resolved_at: null,
  closed_at: null,
  cancelled_at: null,
  creator: { id: "user-1", display_name: "Ada" },
  team: { id: 2, name: "Platform" },
};

function authenticate() {
  getSession.mockResolvedValue({
    data: { session: { access_token: "token-1" } },
    error: null,
  });
}

describe("tickets API", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects ticket calls when the user has no session", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    getSession.mockResolvedValue({ data: { session: null }, error: null });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getTickets()).rejects.toThrow("User is not authenticated");
    await expect(createTicket({
      title: "Login fails",
      description: "The form returns 500",
      teamId: 2,
      priority: "high",
    })).rejects.toThrow("User is not authenticated");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("creates a ticket", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    authenticate();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(ticket)));

    const input = {
      title: "Login fails",
      description: "The form returns 500",
      teamId: 2,
      affectedUrl: "https://app.example/login",
      curl: "curl https://app.example/login",
      priority: "high" as const,
    };

    await expect(createTicket(input)).resolves.toEqual(ticket);
    expect(fetch).toHaveBeenCalledWith("https://api.example/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-1",
      },
      body: JSON.stringify(input),
    });
  });

  it("loads one ticket and the ticket list", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    authenticate();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(ticket)));

    await expect(getTicketById(4)).resolves.toEqual(ticket);
    expect(fetch).toHaveBeenCalledWith("https://api.example/api/tickets/4", {
      headers: { Authorization: "Bearer token-1" },
    });

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json([ticket])));
    await expect(getTickets()).resolves.toEqual([ticket]);
    expect(fetch).toHaveBeenCalledWith("https://api.example/api/tickets", {
      headers: { Authorization: "Bearer token-1" },
    });
  });

  it("sends ticket updates to the matching endpoints", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    authenticate();
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(Response.json(ticket)),
    );
    vi.stubGlobal("fetch", fetchMock);

    const update = { title: "Login still fails", priority: "urgent" as const };
    await updateTicket(4, update);
    await cancelTicket(4);
    await startTicketReview(4);
    await referTicket(4, { message: "Needs the payments team" });
    await resolveTicket(4, { resolution: "Reset the session cookie" });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.example/api/tickets/4",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-1",
        },
        body: JSON.stringify(update),
      },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.example/api/tickets/4/cancel",
      {
        method: "PATCH",
        headers: { Authorization: "Bearer token-1" },
      },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "https://api.example/api/tickets/4/review",
      {
        method: "PATCH",
        headers: { Authorization: "Bearer token-1" },
      },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      "https://api.example/api/tickets/4/refer",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-1",
        },
        body: JSON.stringify({ message: "Needs the payments team" }),
      },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      5,
      "https://api.example/api/tickets/4/resolve",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-1",
        },
        body: JSON.stringify({ resolution: "Reset the session cookie" }),
      },
    );
  });

  it("deletes a ticket", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    authenticate();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );

    await expect(deleteTicket(4)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith("https://api.example/api/tickets/4", {
      method: "DELETE",
      headers: { Authorization: "Bearer token-1" },
    });
  });

  it("throws the endpoint error when a ticket request fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example");
    authenticate();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    await expect(getTickets()).rejects.toThrow("Failed to get tickets");
    await expect(getTicketById(4)).rejects.toThrow("Failed to get ticket");
    await expect(cancelTicket(4)).rejects.toThrow("Failed to cancel ticket");
    await expect(deleteTicket(4)).rejects.toThrow("Failed to delete ticket");
  });
});
