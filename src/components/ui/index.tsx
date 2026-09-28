"use client";

import type { TicketPriority, TicketStatus } from "@/api/tickets/types";

import {
  Alert,
  Badge,
  Button,
  ButtonLink,
  Card,
  CardTitle,
  CodeTextarea,
  EmptyState,
  FieldError,
  FieldHint,
  FieldRow,
  Form,
  FormActions,
  FormCard,
  Message,
  NarrowPage,
  Notice,
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
  Section,
  SectionTitle,
  TextButton,
  type BadgeTone,
} from "./styles";

export {
  Alert,
  Button,
  ButtonLink,
  Card,
  CardTitle,
  CodeTextarea,
  EmptyState,
  FieldError,
  FieldHint,
  FieldRow,
  Form,
  FormActions,
  FormCard,
  Message,
  NarrowPage,
  Notice,
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
  Section,
  SectionTitle,
  TextButton,
};

const statusBadges: Record<TicketStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: "Pending", tone: "neutral" },
  in_review: { label: "In review", tone: "blue" },
  referred: { label: "Referred", tone: "amber" },
  resolved: { label: "Resolved", tone: "green" },
  closed: { label: "Closed", tone: "dark" },
  cancelled: { label: "Cancelled", tone: "muted" },
};

const priorityBadges: Record<TicketPriority, { label: string; tone: BadgeTone }> =
  {
    urgent: { label: "Urgent", tone: "red" },
    high: { label: "High", tone: "amber" },
    medium: { label: "Medium", tone: "neutral" },
    low: { label: "Low", tone: "neutral" },
  };

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, tone } = statusBadges[status] ?? statusBadges.pending;

  return (
    <Badge $tone={tone} $dot>
      {label}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const { label, tone } = priorityBadges[priority] ?? priorityBadges.medium;

  return <Badge $tone={tone}>{label}</Badge>;
}
