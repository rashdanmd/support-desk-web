import { createClient } from "@/lib/supabase/client";
import type { CreateTicketData, Ticket } from "./types";

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

export const getTicketById = async (id: number): Promise<Ticket> => {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get ticket");
  }

  return response.json();
};
