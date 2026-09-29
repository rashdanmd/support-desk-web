import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ticket } from "@/test/ticket";

const getTicketById = vi.hoisted(() => vi.fn());
const getTeams = vi.hoisted(() => vi.fn());

vi.mock("@/api/tickets", () => ({
  getTicketById,
  updateTicket: vi.fn(),
}));

vi.mock("@/api/teams", () => ({
  getTeams,
}));

import EditTicketPage from "./page";

describe("edit ticket page", () => {
  beforeEach(() => {
    getTicketById.mockResolvedValue(ticket);
    getTeams.mockResolvedValue([{ id: 2, name: "Platform", description: null }]);
  });

  it("loads the ticket into the form", async () => {
    render(<EditTicketPage />);

    expect(await screen.findByRole("heading", { name: "Edit ticket" })).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Login fails");
    expect(screen.getByLabelText("Description")).toHaveValue("The form returns 500");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
