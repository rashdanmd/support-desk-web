"use client";

import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const Backdrop = styled.button`
  position: absolute;
  inset: 0;
  border: 0;
  padding: 0;
  background: rgba(24, 24, 27, 0.32);
  cursor: default;
`;

export const Dialog = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-popover);
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

export const Description = styled.p`
  margin-top: 8px;
  color: var(--color-text-subtle);
  font-size: 14px;
  line-height: 20px;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;
