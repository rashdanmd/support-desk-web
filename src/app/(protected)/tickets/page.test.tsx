import { describe, expect, it } from "vitest";

import { navigationMocks } from "@/test/navigation";

import TicketsPage from "./page";

describe("tickets page", () => {
  it("redirects to the ticket board", () => {
    expect(() => TicketsPage()).toThrow("NEXT_REDIRECT:/");
    expect(navigationMocks.redirect).toHaveBeenCalledWith("/");
  });
});
