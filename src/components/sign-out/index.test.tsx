import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SignOut from "./index";

describe("SignOut", () => {
  it("calls onClick from the menu item", () => {
    const onClick = vi.fn();

    render(<SignOut onClick={onClick} />);
    fireEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
