import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConfirmDialog from "./index";

const props = {
  title: "Delete this ticket?",
  description: "This permanently removes the ticket.",
  confirmLabel: "Delete ticket",
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

describe("ConfirmDialog", () => {
  it("renders nothing while closed", () => {
    const { container } = render(<ConfirmDialog open={false} {...props} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("confirms and cancels from the dialog", () => {
    render(<ConfirmDialog open {...props} cancelLabel="Go back" />);

    expect(screen.getByRole("dialog", { name: "Delete this ticket?" })).toBeInTheDocument();
    expect(screen.getByText("This permanently removes the ticket.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete ticket" }));
    fireEvent.click(screen.getByRole("button", { name: "Go back" }));

    expect(props.onConfirm).toHaveBeenCalledOnce();
    expect(props.onCancel).toHaveBeenCalledOnce();
  });

  it("cancels on Escape unless the action is pending", () => {
    const onCancel = vi.fn();
    const { rerender } = render(
      <ConfirmDialog open {...props} onCancel={onCancel} />,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();

    rerender(
      <ConfirmDialog
        open
        {...props}
        onCancel={onCancel}
        pending
        pendingLabel="Deleting…"
      />,
    );

    expect(screen.getByRole("button", { name: "Deleting…" })).toBeDisabled();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
