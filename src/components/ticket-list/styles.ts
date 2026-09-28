"use client";

import styled from "styled-components";

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Row = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-xs);
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    border-color: var(--color-border-strong);
    box-shadow: var(--shadow-popover);
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 24px;
  }
`;

export const OpenButton = styled.button`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible::after {
    border-radius: inherit;
    box-shadow: inset 0 0 0 2px var(--color-accent);
  }
`;

export const Title = styled.span`
  display: block;
  overflow: hidden;
  color: var(--color-text);
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Description = styled.span`
  display: block;
  margin-top: 2px;
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Meta = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 8px;
  color: var(--color-text-subtle);
  font-size: 12px;
  line-height: 16px;

  & > * + *::before {
    content: "·";
    margin-right: 8px;
    color: var(--color-text-faint);
  }
`;

export const Aside = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

export const Badges = styled.div`
  display: flex;
  gap: 6px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 6px;

  @media (min-width: 768px) {
    margin-left: 8px;
  }
`;
