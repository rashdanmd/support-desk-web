export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus =
  | "pending"
  | "in_review"
  | "referred"
  | "resolved"
  | "closed"
  | "cancelled";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  team_id: number;
  affected_url: string | null;
  curl: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  created_by: string;
  assigned_to: string | null;
  resolution: string | null;
  referred_to: string | null;
  referral_message: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
  cancelled_at: string | null;

  creator: {
    id: string;
    display_name: string;
  };
};

export type CreateTicketData = {
  title: string;
  description: string;
  teamId: number;
  affectedUrl?: string;
  curl?: string;
  priority: "low" | "medium" | "high" | "urgent";
};
