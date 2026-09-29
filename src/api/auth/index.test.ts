import { beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.hoisted(() => vi.fn());
const signInWithPassword = vi.hoisted(() => vi.fn());
const signUp = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession,
      signInWithPassword,
      signUp,
    },
  }),
}));

import { getAccessToken, signInWithEmail, signUpWithEmail } from "./index";

describe("auth API", () => {
  beforeEach(() => {
    getSession.mockReset();
    signInWithPassword.mockReset();
    signUp.mockReset();
  });

  it("returns the session from a successful email sign-in", async () => {
    const session = { user: { id: "user-1" } };
    signInWithPassword.mockResolvedValue({ data: session, error: null });

    await expect(signInWithEmail("ada@company.com", "secret")).resolves.toBe(
      session,
    );
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "ada@company.com",
      password: "secret",
    });
  });

  it("throws the Supabase error when sign-in fails", async () => {
    const error = new Error("Invalid login credentials");
    signInWithPassword.mockResolvedValue({ data: null, error });

    await expect(signInWithEmail("ada@company.com", "nope")).rejects.toBe(
      error,
    );
  });

  it("trims names before storing sign-up metadata", async () => {
    const session = { user: { id: "user-1" } };
    signUp.mockResolvedValue({ data: session, error: null });

    await expect(
      signUpWithEmail(" Ada ", " Lovelace ", "ada@company.com", "secret"),
    ).resolves.toBe(session);

    expect(signUp).toHaveBeenCalledWith({
      email: "ada@company.com",
      password: "secret",
      options: {
        data: {
          first_name: "Ada",
          last_name: "Lovelace",
          full_name: "Ada Lovelace",
        },
      },
    });
  });

  it("throws the Supabase error when sign-up fails", async () => {
    const error = new Error("User already registered");
    signUp.mockResolvedValue({ data: null, error });

    await expect(
      signUpWithEmail("Ada", "Lovelace", "ada@company.com", "secret"),
    ).rejects.toBe(error);
  });

  it("returns the current access token", async () => {
    getSession.mockResolvedValue({
      data: { session: { access_token: "token-1" } },
      error: null,
    });

    await expect(getAccessToken()).resolves.toBe("token-1");
  });

  it("rejects when there is no usable session", async () => {
    getSession.mockResolvedValue({
      data: { session: null },
      error: new Error("expired"),
    });

    await expect(getAccessToken()).rejects.toThrow("User is not authenticated");
  });
});
