"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

import SignOut from "@/components/sign-out";
import { ButtonLink } from "@/components/ui";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Tickets" },
  { href: "/my-tickets", label: "My tickets" },
];

const Shell = styled.div`
  min-height: 100vh;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: calc(var(--content-width) + 64px);
  height: 56px;
  margin: 0 auto;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 32px;
    padding: 0 32px;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.01em;
`;

const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--color-accent-text);
  font-size: 12px;
  font-weight: 700;
`;

const BrandName = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  padding: 6px 10px;
  border-radius: var(--radius-md);
  color: ${({ $active }) =>
    $active ? "var(--color-text)" : "var(--color-text-subtle)"};
  background: ${({ $active }) =>
    $active ? "var(--color-surface-hover)" : "transparent"};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  transition:
    color 120ms ease,
    background-color 120ms ease;

  &:hover {
    color: var(--color-text);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const NewTicketLabel = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`;

const Account = styled.div`
  position: relative;
`;

const PersonaButton = styled.button`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface-hover);
  color: var(--color-text-muted);
  transition: border-color 120ms ease;

  &:hover {
    border-color: var(--color-border-strong);
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  min-width: 180px;
  padding: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-popover);

  button {
    width: 100%;
    padding: 8px 10px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text);
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }

  button:hover {
    background: var(--color-surface-hover);
  }
`;

const Content = styled.div`
  padding: 24px 16px 64px;

  @media (min-width: 768px) {
    padding: 40px 32px 80px;
  }
`;

function PersonaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
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

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <HeaderInner>
          <Brand href="/">
            <BrandMark aria-hidden="true">S</BrandMark>
            <BrandName>Support Desk</BrandName>
          </Brand>

          <Nav aria-label="Primary">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  $active={active}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </Nav>

          <HeaderActions>
            <ButtonLink
              href="/tickets/new"
              $variant="primary"
              $size="sm"
              aria-label="New ticket"
            >
              <PlusIcon />
              <NewTicketLabel>New ticket</NewTicketLabel>
            </ButtonLink>

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
        </HeaderInner>
      </Header>

      <Content>{children}</Content>
    </Shell>
  );
}
