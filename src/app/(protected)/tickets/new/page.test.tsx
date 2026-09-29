import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/api/teams", () => ({
  getTeams: vi.fn().mockResolvedValue([
    { id: 2, name: "Platform", description: null },
  ]),
}));

import NewTicketPage from "./page";

describe("new ticket page", () => {
  it("shows the create form", async () => {
    render(<NewTicketPage />);

    expect(
      screen.getByRole("heading", { name: "Create a support request" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(await screen.findByRole("option", { name: "Platform" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create ticket" })).toBeInTheDocument();
  });
});
