import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SignInPage from "@/app/sign-in/page";

describe("sign-in page", () => {
  it("asks for an email and password", async () => {
    render(<SignInPage />);

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with Google" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });
});
