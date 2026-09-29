import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ticket } from "@/test/ticket";

const getTickets = vi.hoisted(() => vi.fn());
const getCurrentUser = vi.hoisted(() => vi.fn());

vi.mock("@/api/tickets", () => ({
  getTickets,
}));

vi.mock("@/api/users", () => ({
  getCurrentUser,
}));

import TicketBoard from "./ticket-board";

describe("TicketBoard", () => {
  beforeEach(() => {
    getCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "ada@company.com",
      role: "user",
    });
  });

  it("shows an empty board", async () => {
    getTickets.mockResolvedValue([]);

    render(<TicketBoard name="Ada" />);

    expect(screen.getByRole("heading", { name: "Support requests" })).toBeInTheDocument();
    expect(screen.getByText("Hello Ada")).toBeInTheDocument();
    expect(await screen.findByText("No tickets yet.")).toBeInTheDocument();
  });

  it("lists loaded tickets", async () => {
    getTickets.mockResolvedValue([ticket]);

    render(<TicketBoard name="Ada" />);

    expect(await screen.findByRole("button", { name: /Login fails/ })).toBeInTheDocument();
  });
});
