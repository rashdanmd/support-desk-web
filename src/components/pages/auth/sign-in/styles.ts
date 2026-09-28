"use client";

import styled from "styled-components";

import { Button } from "@/components/ui";

export const Divider = styled.p`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: var(--color-text-faint);
  font-size: 12px;
  line-height: 16px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }
`;

export const FullWidthButton = styled(Button)`
  width: 100%;
`;
