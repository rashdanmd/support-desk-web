import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { navigationMocks } from "@/test/navigation";

import TicketPane, { useTicketPane } from "./index";

vi.mock("@/components/pages/ticket-details", () => ({
  default: ({ ticketId }: { ticketId: number }) => <p>Details for {ticketId}</p>,
}));

function PaneProbe() {
  const { selectedId, openTicket, closeTicket } = useTicketPane();

  return (
    <div>
      <span>selected:{String(selectedId)}</span>
      <button type="button" onClick={() => openTicket(8)}>
        Open
      </button>
      <button type="button" onClick={closeTicket}>
        Close pane
      </button>
    </div>
  );
}

describe("TicketPane", () => {
  it("renders nothing without a selected ticket", () => {
    const { container } = render(<TicketPane ticketId={null} onClose={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows the selected ticket and closes after the panel slides away", () => {
    const onClose = vi.fn();

    render(<TicketPane ticketId={4} onClose={onClose} />);

    expect(screen.getByRole("dialog", { name: "Ticket details" })).toBeInTheDocument();
    expect(screen.getByText("Ticket #4")).toBeInTheDocument();
    expect(screen.getByText("Details for 4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.transitionEnd(screen.getByRole("dialog"), {
      propertyName: "transform",
    });

    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe("useTicketPane", () => {
  it("reads and updates the ticket query", () => {
    navigationMocks.searchParams.set("ticket", "4");
    navigationMocks.pathname = "/my-tickets";

    render(<PaneProbe />);

    expect(screen.getByText("selected:4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(navigationMocks.push).toHaveBeenCalledWith("/my-tickets?ticket=8", {
      scroll: false,
    });

    fireEvent.click(screen.getByRole("button", { name: "Close pane" }));
    expect(navigationMocks.push).toHaveBeenCalledWith("/my-tickets", {
      scroll: false,
    });
  });

  it("ignores a ticket query that is not a positive id", () => {
    navigationMocks.searchParams.set("ticket", "nope");

    render(<PaneProbe />);

    expect(screen.getByText("selected:null")).toBeInTheDocument();
  });
});
