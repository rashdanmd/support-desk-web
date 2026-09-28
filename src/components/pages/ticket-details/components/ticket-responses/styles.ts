"use client";

import styled from "styled-components";

import { Form } from "@/components/ui";

export const ResponseList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ResponseItem = styled.li`
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
`;

export const ResponseHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
`;

export const Author = styled.span`
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
`;

export const Timestamp = styled.time`
  color: var(--color-text-subtle);
  font-size: 12px;
  line-height: 16px;
`;

export const ResponseBody = styled.p`
  color: var(--color-text);
  font-size: 14px;
  line-height: 22px;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const Composer = styled(Form)`
  margin-top: 8px;
`;
