import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const signInWithOAuth = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { signInWithOAuth },
  }),
}));

import GoogleSignIn from "./index";

describe("GoogleSignIn", () => {
  it("starts Google sign-in", async () => {
    signInWithOAuth.mockResolvedValue({ error: null });

    render(<GoogleSignIn />);
    fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  });
});
