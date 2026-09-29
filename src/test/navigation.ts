import { vi } from "vitest";

export const navigationMocks = {
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  redirect: vi.fn(),
  pathname: "/",
  searchParams: new URLSearchParams(),
  params: { id: "4" } as Record<string, string>,
};

export function resetNavigation() {
  navigationMocks.push.mockClear();
  navigationMocks.refresh.mockClear();
  navigationMocks.replace.mockClear();
  navigationMocks.back.mockClear();
  navigationMocks.redirect.mockClear();
  navigationMocks.pathname = "/";
  navigationMocks.searchParams = new URLSearchParams();
  navigationMocks.params = { id: "4" };
}
