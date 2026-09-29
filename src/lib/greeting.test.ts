import { describe, expect, it } from "vitest";

import { greetingName } from "./greeting";

describe("greetingName", () => {
  it("prefers a first name from user metadata", () => {
    expect(
      greetingName({
        email: "ada@company.com",
        user_metadata: { first_name: " ada ", full_name: "Grace Hopper" },
      }),
    ).toBe("Ada");
  });

  it("falls back through given name, full name, then display name", () => {
    expect(
      greetingName({
        user_metadata: { given_name: "grace" },
      }),
    ).toBe("Grace");

    expect(
      greetingName({
        user_metadata: { full_name: "grace hopper" },
      }),
    ).toBe("Grace");

    expect(
      greetingName({
        user_metadata: { name: "katherine johnson" },
      }),
    ).toBe("Katherine");
  });

  it("uses the email local part when metadata has no name", () => {
    expect(greetingName({ email: "ada@company.com", user_metadata: {} })).toBe(
      "Ada",
    );
  });

  it("ignores non-string metadata and uses a generic fallback", () => {
    expect(
      greetingName({
        email: null,
        user_metadata: { first_name: 12, name: null },
      }),
    ).toBe("there");
  });
});
