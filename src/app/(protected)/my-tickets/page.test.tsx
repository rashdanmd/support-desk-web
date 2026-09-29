import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ticket } from "@/test/ticket";

const getUser = vi.hoisted(() => vi.fn());
const getTickets = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getUser },
  }),
}));

vi.mock("@/api/tickets", () => ({
  getTickets,
  cancelTicket: vi.fn(),
}));

import MyTicketsPage from "./page";

describe("my tickets page", () => {
  beforeEach(() => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
  });

  it("shows an empty list", async () => {
    getTickets.mockResolvedValue([]);

    render(<MyTicketsPage />);

    expect(screen.getByRole("heading", { name: "My tickets" })).toBeInTheDocument();
    expect(
      await screen.findByText("You have not raised any tickets yet."),
    ).toBeInTheDocument();
  });

  it("shows the signed-in user's pending ticket actions", async () => {
    getTickets.mockResolvedValue([ticket]);

    render(<MyTicketsPage />);

    expect(await screen.findByRole("button", { name: /Login fails/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/tickets/4/edit",
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.queryByText("Ada")).not.toBeInTheDocument();
  });
});
