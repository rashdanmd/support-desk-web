"use client";

import Link from "next/link";
import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

type ButtonStyleProps = {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
};

const buttonVariants: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    border-color: var(--color-accent);
    background: var(--accent-gradient);
    color: var(--color-accent-text);

    &:hover:not(:disabled) {
      border-color: var(--color-accent-hover);
      background: var(--accent-gradient-hover);
    }
  `,
  secondary: css`
    border-color: var(--color-border-strong);
    background: var(--color-surface);
    color: var(--color-text);
    box-shadow: var(--shadow-xs);

    &:hover:not(:disabled) {
      background: var(--color-surface-hover);
    }
  `,
  ghost: css`
    border-color: transparent;
    background: transparent;
    color: var(--color-text-muted);

    &:hover:not(:disabled) {
      background: var(--color-surface-hover);
      color: var(--color-text);
    }
  `,
  danger: css`
    border-color: var(--color-border-strong);
    background: var(--color-surface);
    color: var(--color-danger);
    box-shadow: var(--shadow-xs);

    &:hover:not(:disabled) {
      border-color: #fecaca;
      background: var(--color-danger-subtle);
    }
  `,
};

const buttonStyles = css<ButtonStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: ${({ $size }) => ($size === "sm" ? "30px" : "36px")};
  padding: 0 ${({ $size }) => ($size === "sm" ? "10px" : "14px")};
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: ${({ $size }) => ($size === "sm" ? "13px" : "14px")};
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease;

  ${({ $variant = "secondary" }) => buttonVariants[$variant]}

  &:disabled {
    opacity: 0.6;
  }
`;

export const Button = styled.button<ButtonStyleProps>`
  ${buttonStyles}
`;

export const ButtonLink = styled(Link)<ButtonStyleProps>`
  ${buttonStyles}
`;

export const TextButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-accent);
  font-weight: 500;

  &:hover {
    color: var(--color-accent-hover);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

export const Card = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
`;

export const CardTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
`;

export const NarrowPage = styled(Page)`
  max-width: 640px;
`;

export const FormCard = styled(Card)`
  padding: 24px;
`;

export const FieldRow = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const CodeTextarea = styled.textarea`
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 18px;
`;

export const FieldHint = styled.span`
  margin-left: 4px;
  color: var(--color-text-faint);
  font-weight: 400;
`;

export const PageHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
`;

export const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: -0.01em;
`;

export const PageDescription = styled.p`
  margin-top: 4px;
  color: var(--color-text-subtle);
  font-size: 14px;
  line-height: 20px;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SectionTitle = styled.h2`
  color: var(--color-text-subtle);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldError = styled.p`
  margin-top: 6px;
  color: var(--color-danger-text);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;

export const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
`;

export const EmptyState = styled.div`
  padding: 48px 24px;
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text-subtle);
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

export const Message = styled.p`
  color: var(--color-text-subtle);
  font-size: 14px;
  line-height: 20px;
`;

export const Alert = styled.p`
  padding: 10px 12px;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  background: var(--color-danger-subtle);
  color: #b91c1c;
  font-size: 13px;
  line-height: 18px;
`;

export const Notice = styled.p`
  padding: 10px 12px;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  background: #f0fdf4;
  color: #15803d;
  font-size: 13px;
  line-height: 18px;
`;

export type BadgeTone =
  | "neutral"
  | "blue"
  | "amber"
  | "green"
  | "dark"
  | "red"
  | "muted";

const badgeTones: Record<
  BadgeTone,
  { background: string; border: string; color: string; dot: string }
> = {
  neutral: {
    background: "#f4f4f5",
    border: "#e4e4e7",
    color: "#52525b",
    dot: "#a1a1aa",
  },
  blue: {
    background: "#eff6ff",
    border: "#dbeafe",
    color: "#1d4ed8",
    dot: "#3b82f6",
  },
  amber: {
    background: "#fffbeb",
    border: "#fde68a",
    color: "#b45309",
    dot: "#f59e0b",
  },
  green: {
    background: "#f0fdf4",
    border: "#bbf7d0",
    color: "#15803d",
    dot: "#22c55e",
  },
  dark: {
    background: "#3f3f46",
    border: "#3f3f46",
    color: "#fafafa",
    dot: "#a1a1aa",
  },
  red: {
    background: "#fef2f2",
    border: "#fecaca",
    color: "#b91c1c",
    dot: "#ef4444",
  },
  muted: {
    background: "transparent",
    border: "#e4e4e7",
    color: "#a1a1aa",
    dot: "#d4d4d8",
  },
};

export const Badge = styled.span<{ $tone: BadgeTone; $dot?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 8px;
  border: 1px solid ${({ $tone }) => badgeTones[$tone].border};
  border-radius: var(--radius-sm);
  background: ${({ $tone }) => badgeTones[$tone].background};
  color: ${({ $tone }) => badgeTones[$tone].color};
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  white-space: nowrap;

  ${({ $dot, $tone }) =>
    $dot &&
    css`
      &::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${badgeTones[$tone].dot};
      }
    `}
`;
