import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DemoSignIn from "./index";

describe("DemoSignIn", () => {
  it("offers the user and support demos", () => {
    render(<DemoSignIn />);

    expect(screen.getByRole("button", { name: "Explore as user" })).toHaveAttribute(
      "value",
      "user",
    );
    expect(screen.getByRole("button", { name: "Explore as support" })).toHaveAttribute(
      "value",
      "support",
    );
    expect(screen.getByText("No account or password required.")).toBeInTheDocument();
  });

  it("shows an alert when demo sign-in is unavailable", () => {
    render(<DemoSignIn unavailable />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Demo sign-in is not available right now.",
    );
  });
});
