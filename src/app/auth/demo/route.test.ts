import { afterEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signInWithPassword },
  })),
}));

import { POST } from "./route";

function demoRequest(role?: string) {
  const body = new FormData();

  if (role) {
    body.set("role", role);
  }

  return new Request("https://desk.example/auth/demo", {
    method: "POST",
    body,
  });
}

describe("demo sign-in", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    signInWithPassword.mockReset();
    vi.restoreAllMocks();
  });

  it("returns home when demo mode is disabled", async () => {
    vi.stubEnv("DEMO_ENABLED", "false");

    const response = await POST(demoRequest("user"));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://desk.example/");
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("reports demo sign-in as unavailable for an unknown role", async () => {
    vi.stubEnv("DEMO_ENABLED", "true");

    const response = await POST(demoRequest("admin"));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://desk.example/?demo=unavailable",
    );
  });

  it("reports demo sign-in as unavailable when credentials are missing", async () => {
    vi.stubEnv("DEMO_ENABLED", "true");
    vi.stubEnv("DEMO_USER_EMAIL", "");
    vi.stubEnv("DEMO_USER_PASSWORD", "");

    const response = await POST(demoRequest("user"));

    expect(response.headers.get("location")).toBe(
      "https://desk.example/?demo=unavailable",
    );
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("signs in with the role credentials and returns home", async () => {
    vi.stubEnv("DEMO_ENABLED", "true");
    vi.stubEnv("DEMO_SUPPORT_EMAIL", "support@example.com");
    vi.stubEnv("DEMO_SUPPORT_PASSWORD", "support-secret");
    signInWithPassword.mockResolvedValue({ error: null });

    const response = await POST(demoRequest("support"));

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "support@example.com",
      password: "support-secret",
    });
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://desk.example/");
  });

  it("reports demo sign-in as unavailable when Supabase rejects it", async () => {
    vi.stubEnv("DEMO_ENABLED", "true");
    vi.stubEnv("DEMO_USER_EMAIL", "user@example.com");
    vi.stubEnv("DEMO_USER_PASSWORD", "user-secret");
    signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(demoRequest("user"));

    expect(response.headers.get("location")).toBe(
      "https://desk.example/?demo=unavailable",
    );
    expect(console.error).toHaveBeenCalledWith(
      "Demo sign-in failed:",
      "Invalid login credentials",
    );
  });
});
