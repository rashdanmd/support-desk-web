import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ticket } from "@/test/ticket";

import TicketList from "./index";

describe("TicketList", () => {
  it("shows the ticket and opens it", () => {
    const onOpen = vi.fn();

    render(<TicketList tickets={[ticket]} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: /Login fails/ }));

    expect(onOpen).toHaveBeenCalledWith(4);
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("hides the creator and renders row actions", () => {
    render(
      <TicketList
        tickets={[ticket]}
        onOpen={vi.fn()}
        showCreator={false}
        renderActions={() => <button type="button">Cancel</button>}
      />,
    );

    expect(screen.queryByText("Ada")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
