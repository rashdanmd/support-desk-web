"use client";

import styled from "styled-components";

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
    color: var(--color-text-faint);
    transform: translateY(-50%);
    pointer-events: none;
  }

  input {
    height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 34px;
    border-color: var(--color-border);
    background: transparent;
    box-shadow: none;
    font-size: 13px;
  }
`;

export const Count = styled.span`
  color: var(--color-text-faint);
  font-weight: 400;
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
  border-radius: 999px;
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
    background-image: ${chevron("#4f46e5")};
    color: var(--color-accent);
  }
`;
