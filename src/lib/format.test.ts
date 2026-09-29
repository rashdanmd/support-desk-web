import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime } from "./format";

describe("date formatting", () => {
  it("formats a calendar date in en-GB", () => {
    expect(formatDate("2026-03-15T00:00:00.000Z")).toBe("15 Mar 2026");
  });

  it("formats a date and time in en-GB", () => {
    expect(formatDateTime("2026-03-15T14:05:00.000Z")).toBe(
      "15 Mar 2026, 14:05",
    );
  });
});
