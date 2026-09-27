import { createClient } from "@/lib/supabase/client";
import type {
  CreateTicketData,
  Ticket,
  UpdateTicketData,
  ReferTicketData,
  ResolveTicketData,
} from "./types";
import { getAccessToken } from "@/api/auth";

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

export const getTickets = async (): Promise<Ticket[]> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get tickets");
  }

  return response.json();
};

export const updateTicket = async (
  id: number,
  data: UpdateTicketData,
): Promise<Ticket> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update ticket");
  }

  return response.json();
};

export const cancelTicket = async (id: number): Promise<Ticket> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/cancel`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to cancel ticket");
  }

  return response.json();
};

export const startTicketReview = async (id: number): Promise<Ticket> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/review`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to start ticket review");
  }

  return response.json();
};

export const referTicket = async (
  id: number,
  data: ReferTicketData,
): Promise<Ticket> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/refer`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to refer ticket");
  }

  return response.json();
};

export const resolveTicket = async (
  id: number,
  data: ResolveTicketData,
): Promise<Ticket> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/resolve`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to resolve ticket");
  }

  return response.json();
};

export const deleteTicket = async (id: number): Promise<void> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete ticket");
  }
};
