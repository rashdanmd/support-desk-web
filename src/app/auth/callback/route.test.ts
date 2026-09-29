import { afterEach, describe, expect, it, vi } from "vitest";

const exchangeCodeForSession = vi.hoisted(() => vi.fn());
const createClient = vi.hoisted(() =>
  vi.fn(async () => ({
    auth: { exchangeCodeForSession },
  })),
);

vi.mock("@/lib/supabase/server", () => ({
  createClient,
}));

import { GET } from "./route";

describe("auth callback", () => {
  afterEach(() => {
    exchangeCodeForSession.mockReset();
    createClient.mockClear();
  });

  it("sends the user home after the auth code is exchanged", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });

    const response = await GET(
      new Request("https://desk.example/auth/callback?code=auth-code"),
    );

    expect(exchangeCodeForSession).toHaveBeenCalledWith("auth-code");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://desk.example/");
  });

  it("redirects to the auth error when the code is missing or rejected", async () => {
    const missingCode = await GET(
      new Request("https://desk.example/auth/callback"),
    );

    expect(createClient).not.toHaveBeenCalled();
    expect(missingCode.headers.get("location")).toBe(
      "https://desk.example/?error=auth",
    );

    exchangeCodeForSession.mockResolvedValue({
      error: new Error("invalid code"),
    });

    const rejected = await GET(
      new Request("https://desk.example/auth/callback?code=bad-code"),
    );

    expect(rejected.headers.get("location")).toBe(
      "https://desk.example/?error=auth",
    );
  });
});
