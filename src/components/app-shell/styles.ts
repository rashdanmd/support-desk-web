"use client";

import Link from "next/link";
import styled from "styled-components";

export const Shell = styled.div`
  min-height: 100vh;
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
`;

export const HeaderInner = styled.div`
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

export const Brand = styled(Link)`
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

export const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: var(--accent-gradient);
  color: var(--color-accent-text);
  font-size: 12px;
  font-weight: 700;
`;

export const BrandName = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const NavLink = styled(Link)<{ $active: boolean }>`
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

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

export const NewTicketLabel = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`;

export const Account = styled.div`
  position: relative;
`;

export const PersonaButton = styled.button`
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

export const Menu = styled.div`
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

export const Content = styled.div`
  padding: 24px 16px 64px;

  @media (min-width: 768px) {
    padding: 40px 32px 80px;
  }
`;
