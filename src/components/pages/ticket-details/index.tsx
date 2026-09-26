"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getTicketById } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";

export default function TicketDetails() {
  const params = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const data = await getTicketById(Number(params.id));
        setTicket(data);
      } catch (error) {
        console.error("Failed to load ticket:", error);
      }
    };

    loadTicket();
  }, [params.id]);

  if (!ticket) {
    return <p>Loading ticket...</p>;
  }

  return (
    <main>
      <h1>{ticket.title}</h1>

      <p>Raised by: {ticket.creator.display_name}</p>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>

      <h2>Description</h2>
      <p>{ticket.description}</p>

      {ticket.affected_url && (
        <>
          <h2>Affected URL</h2>
          <p>{ticket.affected_url}</p>
        </>
      )}

      {ticket.curl && (
        <>
          <h2>cURL</h2>
          <pre>{ticket.curl}</pre>
        </>
      )}
    </main>
  );
}
