"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import ConfirmDialog from "@/components/confirm-dialog";
import SignOut from "@/components/sign-out";
import { ButtonLink } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

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
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
      <circle
        cx="8"
        cy="5.25"
        r="2.15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M3.35 13.15c.65-2.05 2.35-3.15 4.65-3.15s4 1.1 4.65 3.15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
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
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;

      if (target instanceof Element && target.closest("[data-confirm-dialog]")) {
        return;
      }

      if (!menuRef.current?.contains(target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector("[data-confirm-dialog]")) {
        return;
      }

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

  const requestSignOut = () => {
    setMenuOpen(false);
    setConfirmSignOut(true);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out failed:", error.message);
      setIsSigningOut(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

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
                  <SignOut onClick={requestSignOut} />
                </Menu>
              )}
            </Account>
          </HeaderActions>
        </HeaderInner>
      </Header>

      <Content>{children}</Content>

      <ConfirmDialog
        open={confirmSignOut}
        title="Sign out?"
        description="You'll need to sign in again to view tickets."
        confirmLabel="Sign out"
        pendingLabel="Signing out…"
        pending={isSigningOut}
        onConfirm={handleSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </Shell>
  );
}
