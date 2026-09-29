import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AppShell from "./index";

describe("AppShell", () => {
  it("shows navigation and asks before signing out", () => {
    render(
      <AppShell>
        <p>Board</p>
      </AppShell>,
    );

    expect(screen.getByText("Board")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tickets" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "New ticket" })).toHaveAttribute(
      "href",
      "/tickets/new",
    );

    fireEvent.click(screen.getByRole("button", { name: "Account menu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));

    expect(screen.getByRole("dialog", { name: "Sign out?" })).toBeInTheDocument();
    expect(
      screen.getByText("You'll need to sign in again to view tickets."),
    ).toBeInTheDocument();
  });
});
