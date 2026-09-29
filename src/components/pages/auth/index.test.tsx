import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Auth from "./index";

describe("Auth", () => {
  it("switches between sign in and sign up", () => {
    render(<Auth />);

    expect(screen.getByRole("heading", { name: "Support Desk" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
    expect(screen.getByRole("heading", { name: "Create an account" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows demo sign-in when it is enabled", () => {
    render(<Auth demoEnabled demoUnavailable />);

    expect(screen.getByRole("button", { name: "Explore as user" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Demo sign-in is not available right now.",
    );
  });
});
