import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const getTicketResponses = vi.hoisted(() => vi.fn());

vi.mock("@/api/responses", () => ({
  getTicketResponses,
  createTicketResponse: vi.fn(),
}));

import TicketResponses from "./index";

const response = {
  id: 9,
  ticket_id: 4,
  user_id: "user-2",
  message: "Looking into this",
  created_at: "2026-03-15T14:05:00.000Z",
  updated_at: "2026-03-15T14:05:00.000Z",
  author: { id: "user-2", display_name: "Grace" },
};

describe("TicketResponses", () => {
  it("shows an empty list and the reply form", async () => {
    getTicketResponses.mockResolvedValue([]);

    render(<TicketResponses ticketId={4} canRespond />);

    expect(await screen.findByText("No responses yet.")).toBeInTheDocument();
    expect(screen.getByLabelText("Add response")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send response" })).toBeInTheDocument();
  });

  it("shows a response without the reply form", async () => {
    getTicketResponses.mockResolvedValue([response]);

    render(<TicketResponses ticketId={4} canRespond={false} />);

    expect(await screen.findByText("Looking into this")).toBeInTheDocument();
    expect(screen.getByText("Grace")).toBeInTheDocument();
    expect(screen.queryByLabelText("Add response")).not.toBeInTheDocument();
  });
});
