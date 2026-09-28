"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import SignOut from "@/components/sign-out";
import { ButtonLink } from "@/components/ui";

import {
  Account,
  Brand,
  BrandMark,
  BrandName,
  Content,
  Header,
  HeaderActions,
  HeaderInner,
  Menu,
  Nav,
  NavLink,
  NewTicketLabel,
  PersonaButton,
  Shell,
} from "./styles";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Tickets" },
  { href: "/my-tickets", label: "My tickets" },
];

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
