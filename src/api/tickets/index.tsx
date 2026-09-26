import { createClient } from "@/lib/supabase/client";

export type CreateTicketData = {
  title: string;
  description: string;
  teamId: number;
  affectedUrl?: string;
  curl?: string;
  priority: "low" | "medium" | "high" | "urgent";
};

export const createTicket = async (data: CreateTicketData) => {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create ticket");
  }

  return response.json();
};
