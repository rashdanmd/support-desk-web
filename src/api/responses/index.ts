import { getAccessToken } from "@/api/auth";

export type TicketResponse = {
  id: number;
  ticket_id: number;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;

  author: {
    id: string;
    display_name: string;
  };
};

export type CreateTicketResponseData = {
  message: string;
};

export const getTicketResponses = async (
  ticketId: number,
): Promise<TicketResponse[]> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}/responses`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get ticket responses");
  }

  return response.json();
};

export const createTicketResponse = async (
  ticketId: number,
  data: CreateTicketResponseData,
): Promise<TicketResponse> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}/responses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create ticket response");
  }

  return response.json();
};
