import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "font-sans" }),
  Geist_Mono: () => ({ variable: "font-mono" }),
}));

vi.mock("./globals.css", () => ({}));

import RootLayout, { metadata } from "./layout";

describe("root layout", () => {
  it("describes the app and renders the page", () => {
    const html = renderToStaticMarkup(
      <RootLayout params={Promise.resolve({})}>
        <p>Desk child</p>
      </RootLayout>,
    );

    expect(metadata.title).toBe("Support Desk");
    expect(metadata.description).toBe("Raise, track and resolve support requests.");
    expect(html).toContain("Desk child");
    expect(html).toContain('lang="en"');
  });
});
