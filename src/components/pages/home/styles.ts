"use client";

import styled from "styled-components";

import { PageDescription, PageTitle } from "@/components/ui/styles";

export const Search = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 768px) {
    width: 280px;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 12px;
    color: var(--color-text-subtle);
    transform: translateY(-50%);
    pointer-events: none;
  }

  input {
    height: 36px;
    padding-left: 34px;
    border-color: var(--color-border-strong);
    background: var(--color-surface);
    box-shadow: var(--shadow-xs);
    font-size: 14px;

    &:hover {
      border-color: var(--color-text-faint);
    }
  }
`;

export const BoardTitle = styled(PageTitle)`
  color: var(--color-accent);
`;

export const Intro = styled.div`
  margin-top: 6px;
`;

export const Greeting = styled.p`
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
`;

export const Welcome = styled(PageDescription)`
  color: var(--color-secondary);
`;

export type SummaryTone =
  | "pending"
  | "in_review"
  | "referred"
  | "resolved"
  | "cancelled"
  | "total";

const summaryTones: Record<
  SummaryTone,
  { color: string; dot: string; wash: string; ring: string }
> = {
  pending: { color: "#3f3f46", dot: "#a1a1aa", wash: "#f4f4f5", ring: "#d4d4d8" },
  in_review: {
    color: "#3d4f86",
    dot: "#6b8fd6",
    wash: "#f1f5fd",
    ring: "#c7d6f3",
  },
  referred: {
    color: "#8a6233",
    dot: "#d9a15b",
    wash: "#fcf6ee",
    ring: "#efd9bb",
  },
  resolved: {
    color: "#3d6b4e",
    dot: "#6fb58a",
    wash: "#f1f8f3",
    ring: "#c5e3cf",
  },
  cancelled: {
    color: "#686870",
    dot: "#d4d4d8",
    wash: "#f7f7f8",
    ring: "#e4e4e7",
  },
  total: { color: "#52525b", dot: "#71717a", wash: "#f7f7f8", ring: "#d4d4d8" },
};

export const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 960px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

export const SummaryButton = styled.button<{
  $active: boolean;
  $tone: SummaryTone;
}>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid
    ${({ $active, $tone }) =>
      $active ? summaryTones[$tone].ring : "var(--color-border)"};
  border-radius: var(--radius-lg);
  background: ${({ $active, $tone }) =>
    $active ? summaryTones[$tone].wash : "var(--color-surface)"};
  color: ${({ $tone }) => summaryTones[$tone].color};
  box-shadow: ${({ $active, $tone }) =>
    $active
      ? `0 0 0 3px ${summaryTones[$tone].wash}`
      : "var(--shadow-xs)"};
  text-align: left;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    transform 140ms ease;

  &:hover {
    border-color: ${({ $tone }) => summaryTones[$tone].ring};
    box-shadow: 0 6px 16px rgba(24, 24, 27, 0.06);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ $tone }) => summaryTones[$tone].dot};
    outline-offset: 2px;
  }
`;

export const SummaryHead = styled.span<{ $tone: SummaryTone }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  &::before {
    content: "";
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $tone }) => summaryTones[$tone].dot};
    box-shadow: 0 0 0 3px ${({ $tone }) => summaryTones[$tone].wash};
  }
`;

export const SummaryValue = styled.span`
  font-size: 26px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
`;

export const SummaryLabel = styled.span`
  overflow: hidden;
  color: var(--color-text-subtle);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const chevron = (color: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5 6 7.5 9 4.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  )}")`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
    justify-content: flex-end;
  }
`;

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

export const FilterSelect = styled.select`
  appearance: none;
  -webkit-appearance: none;
  width: auto;
  height: 30px;
  padding: 0 28px 0 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: transparent;
  background-image: ${chevron("#71717a")};
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  box-shadow: none;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease;

  &:hover {
    border-color: var(--color-border-strong);
    background-color: var(--color-surface);
    color: var(--color-text);
  }

  &[data-active="true"] {
    border-color: transparent;
    background-color: var(--color-accent-subtle);
    background-image: ${chevron("#7c3aed")};
    color: var(--color-accent);
  }
`;
