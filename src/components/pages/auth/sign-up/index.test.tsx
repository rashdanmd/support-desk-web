import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SignUp from "./index";

describe("SignUp", () => {
  it("asks for the missing account details", async () => {
    render(<SignUp />);

    expect(
      screen.getByRole("heading", { name: "Create an account" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Please enter your first name")).toBeInTheDocument();
    expect(screen.getByText("Please enter your surname")).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });
});
