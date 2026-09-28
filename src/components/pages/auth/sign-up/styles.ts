"use client";

import styled from "styled-components";

import { Button } from "@/components/ui";

export const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidthButton = styled(Button)`
  width: 100%;
`;
