"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

import SignOut from "@/components/sign-out";

type AppShellProps = {
  children: ReactNode;
};

const Shell = styled.div`
  min-height: 100vh;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 64px;
  padding: 12px 16px;
  background: var(--background);
  border-bottom: 1px solid
    color-mix(in srgb, var(--foreground) 16%, transparent);
`;

const Brand = styled(Link)`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  white-space: nowrap;
  background: ${({ $active }) =>
    $active
      ? "color-mix(in srgb, var(--foreground) 8%, transparent)"
      : "transparent"};
`;

const Account = styled.div`
  position: relative;
`;

const PersonaButton = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid color-mix(in srgb, var(--foreground) 24%, transparent);
  border-radius: 18px;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;

const Menu = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  min-width: 160px;
  padding: 8px;
  background: var(--background);
  border: 1px solid color-mix(in srgb, var(--foreground) 16%, transparent);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  button {
    width: 100%;
    min-height: 40px;
    padding: 8px 12px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: inherit;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    cursor: pointer;
  }

  button:hover {
    background: color-mix(in srgb, var(--foreground) 8%, transparent);
  }
`;

const Content = styled.div`
  padding: 16px;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

function PersonaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="7" r="3" fill="currentColor" />
      <path
        d="M4.5 16.5c1.1-2.3 3.1-3.5 5.5-3.5s4.4 1.2 5.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const myTicketsActive = pathname === "/my-tickets";

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <Shell>
      <Header>
        <Brand href="/">Help team support desk</Brand>

        <HeaderActions>
          <nav aria-label="Primary">
            <NavLink href="/my-tickets" $active={myTicketsActive}>
              My tickets
            </NavLink>
          </nav>

          <Account ref={menuRef}>
            <PersonaButton
              type="button"
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <PersonaIcon />
            </PersonaButton>

            {menuOpen && (
              <Menu role="menu">
                <SignOut />
              </Menu>
            )}
          </Account>
        </HeaderActions>
      </Header>

      <Content>{children}</Content>
    </Shell>
  );
}
