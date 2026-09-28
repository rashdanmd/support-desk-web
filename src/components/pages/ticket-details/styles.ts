"use client";

import styled from "styled-components";

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: -0.01em;
`;

export const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const MetaList = styled.dl`
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 8px 16px;
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
  line-height: 18px;

  dt {
    color: var(--color-text-subtle);
  }

  dd {
    color: var(--color-text);
  }
`;

export const Body = styled.p`
  color: var(--color-text);
  font-size: 14px;
  line-height: 22px;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const Mono = styled.p`
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 20px;
  word-break: break-all;
`;

export const Code = styled.pre`
  padding: 12px 14px;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 18px;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const Callout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  background: #f0fdf4;

  h2 {
    color: #15803d;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Panel = styled.div`
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-muted);
`;
