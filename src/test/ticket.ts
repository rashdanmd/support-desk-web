import type { Ticket } from "@/api/tickets/types";

export const ticket: Ticket = {
  id: 4,
  title: "Login fails",
  description: "The form returns 500",
  team_id: 2,
  affected_url: "https://app.example/login",
  curl: "curl https://app.example/login",
  priority: "high",
  status: "pending",
  created_by: "user-1",
  assigned_to: null,
  resolution: null,
  referred_to: null,
  referral_message: null,
  created_at: "2026-03-15T14:05:00.000Z",
  updated_at: "2026-03-15T14:05:00.000Z",
  resolved_at: null,
  closed_at: null,
  cancelled_at: null,
  creator: { id: "user-1", display_name: "ada" },
  team: { id: 2, name: "Platform" },
};
