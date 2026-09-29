import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ticket } from "@/test/ticket";

const getTicketById = vi.hoisted(() => vi.fn());
const getCurrentUser = vi.hoisted(() => vi.fn());
const getTicketResponses = vi.hoisted(() => vi.fn());

vi.mock("@/api/tickets", () => ({
  getTicketById,
  cancelTicket: vi.fn(),
  deleteTicket: vi.fn(),
  referTicket: vi.fn(),
  resolveTicket: vi.fn(),
  startTicketReview: vi.fn(),
}));

vi.mock("@/api/users", () => ({
  getCurrentUser,
}));

vi.mock("@/api/responses", () => ({
  getTicketResponses,
  createTicketResponse: vi.fn(),
}));

import TicketDetails from "./index";

describe("TicketDetails", () => {
  beforeEach(() => {
    getTicketResponses.mockResolvedValue([]);
  });

  it("shows a ticket the current user can edit", async () => {
    getCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "ada@company.com",
      role: "user",
    });
    getTicketById.mockResolvedValue(ticket);

    render(<TicketDetails ticketId={4} onClose={vi.fn()} />);

    expect(screen.getByText("Loading ticket…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Login fails" })).toBeInTheDocument();
    expect(screen.getByText("The form returns 500")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edit ticket" })).toHaveAttribute(
      "href",
      "/tickets/4/edit",
    );
    expect(screen.getByRole("button", { name: "Cancel ticket" })).toBeInTheDocument();
    expect(screen.getByText("No responses yet.")).toBeInTheDocument();
  });

  it("offers review to support for a pending ticket", async () => {
    getCurrentUser.mockResolvedValue({
      id: "support-1",
      email: "support@company.com",
      role: "support",
    });
    getTicketById.mockResolvedValue(ticket);

    render(<TicketDetails ticketId={4} onClose={vi.fn()} />);

    expect(await screen.findByRole("button", { name: "Start review" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Edit ticket" })).not.toBeInTheDocument();
  });
});
