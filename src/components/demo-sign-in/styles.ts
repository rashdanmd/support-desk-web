"use client";

import styled from "styled-components";

import { Button } from "@/components/ui";

export const DemoForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FullWidthButton = styled(Button)`
  width: 100%;
`;

export const Hint = styled.p`
  color: var(--color-text-faint);
  font-size: 12px;
  line-height: 16px;
  text-align: center;
`;
