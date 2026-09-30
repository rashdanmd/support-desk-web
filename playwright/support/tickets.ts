import type { Ticket, TicketPriority, TicketStatus } from "../../src/api/tickets/types";

export const SIGNED_IN_USER = "signed-in-user";

export const ticket = (overrides: Partial<Ticket> = {}): Ticket => ({
  id: 4,
  title: "Login fails",
  description: "The form returns 500",
  team_id: 2,
  affected_url: "https://app.example/login",
  curl: "curl https://app.example/login",
  priority: "high",
  status: "pending",
  created_by: SIGNED_IN_USER,
  assigned_to: null,
  resolution: null,
  referred_to: null,
  referral_message: null,
  created_at: "2026-03-15T14:05:00.000Z",
  updated_at: "2026-03-15T14:05:00.000Z",
  resolved_at: null,
  closed_at: null,
  cancelled_at: null,
  creator: { id: SIGNED_IN_USER, display_name: "ada" },
  team: { id: 2, name: "Platform" },
  ...overrides,
});

export const boardTickets = (): Ticket[] => [
  ticket(),
  ticket({
    id: 8,
    title: "Search is slow",
    description: "Results take more than ten seconds",
    priority: "medium" satisfies TicketPriority,
    status: "in_review" satisfies TicketStatus,
    created_by: "other-user",
    creator: { id: "other-user", display_name: "sam" },
    team: { id: 3, name: "Identity" },
    team_id: 3,
  }),
];
