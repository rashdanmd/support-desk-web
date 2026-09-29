import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { navigationMocks, resetNavigation } from "./navigation";

afterEach(() => {
  cleanup();
  resetNavigation();
  vi.unstubAllEnvs();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: navigationMocks.push,
    refresh: navigationMocks.refresh,
    replace: navigationMocks.replace,
    back: navigationMocks.back,
  }),
  usePathname: () => navigationMocks.pathname,
  useSearchParams: () => navigationMocks.searchParams,
  useParams: () => navigationMocks.params,
  redirect: (url: string) => {
    navigationMocks.redirect(url);
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
  useServerInsertedHTML: () => {},
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children?: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
