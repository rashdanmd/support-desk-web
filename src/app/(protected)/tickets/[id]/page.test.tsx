import { describe, expect, it } from "vitest";

import { navigationMocks } from "@/test/navigation";

import TicketPage from "./page";

describe("ticket page", () => {
  it("opens the ticket on the board", async () => {
    await expect(
      TicketPage({
        params: Promise.resolve({ id: "9" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_REDIRECT:/?ticket=9");

    expect(navigationMocks.redirect).toHaveBeenCalledWith("/?ticket=9");
  });
});
