"use client";

import styled from "styled-components";

import { Card } from "@/components/ui";

export const Layout = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 48px 16px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 400px;
`;

export const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

export const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--accent-gradient);
  color: var(--color-accent-text);
  font-size: 16px;
  font-weight: 700;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: -0.01em;
`;

export const Tagline = styled.p`
  margin-top: 2px;
  color: var(--color-text-subtle);
  font-size: 14px;
  line-height: 20px;
`;

export const Panel = styled(Card)`
  padding: 24px;
`;

export const Switch = styled.p`
  color: var(--color-text-subtle);
  font-size: 13px;
  line-height: 18px;
  text-align: center;
`;
