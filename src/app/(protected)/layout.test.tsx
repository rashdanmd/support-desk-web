import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const getUser = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser },
  }),
}));

import ProtectedLayout from "./layout";

describe("protected layout", () => {
  it("sends anonymous visitors home", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    await expect(ProtectedLayout({ children: <p>Queue</p> })).rejects.toThrow(
      "NEXT_REDIRECT:/",
    );
  });

  it("shows the app shell for a signed-in user", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    render(await ProtectedLayout({ children: <p>Queue</p> }));

    expect(screen.getByText("Queue")).toBeInTheDocument();
    expect(screen.getByText("Support Desk")).toBeInTheDocument();
  });
});
