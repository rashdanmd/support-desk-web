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
    padding-left: 34px;
  }
`;

export const Count = styled.span`
  color: var(--color-text-faint);
  font-weight: 400;
`;
