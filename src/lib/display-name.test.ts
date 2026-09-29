import { describe, expect, it } from "vitest";

import { displayName } from "./display-name";

describe("displayName", () => {
  it("capitalises a plain name", () => {
    expect(displayName("ada")).toBe("Ada");
  });

  it("trims surrounding whitespace", () => {
    expect(displayName("  grace  ")).toBe("Grace");
  });

  it("uses the local part of an email address", () => {
    expect(displayName("ada.lovelace@company.com")).toBe("Ada.lovelace");
  });

  it("returns an empty string when nothing usable remains", () => {
    expect(displayName("   ")).toBe("");
    expect(displayName("@company.com")).toBe("");
  });
});
