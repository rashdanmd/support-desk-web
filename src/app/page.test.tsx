import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.hoisted(() => vi.fn());
const getTickets = vi.hoisted(() => vi.fn());
const getCurrentUser = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser },
  }),
}));

vi.mock("@/api/tickets", () => ({
  getTickets,
}));

vi.mock("@/api/users", () => ({
  getCurrentUser,
}));

import HomePage from "./page";

describe("home page", () => {
  beforeEach(() => {
    getTickets.mockResolvedValue([]);
    getCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "ada@company.com",
      role: "user",
    });
  });

  it("shows sign-in when nobody is signed in", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    render(await HomePage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Explore as user" })).not.toBeInTheDocument();
  });

  it("shows the ticket board for a signed-in user", async () => {
    getUser.mockResolvedValue({
      data: {
        user: {
          email: "ada@company.com",
          user_metadata: { first_name: "Ada" },
        },
      },
    });

    render(await HomePage({ searchParams: Promise.resolve({}) }));

    expect(await screen.findByText("Hello Ada")).toBeInTheDocument();
    expect(await screen.findByText("No tickets yet.")).toBeInTheDocument();
  });
});
