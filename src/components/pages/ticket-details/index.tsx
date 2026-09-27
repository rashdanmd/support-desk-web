"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getTicketById } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";
import { createClient } from "@/lib/supabase/client";

export default function TicketDetails() {
  const params = useParams<{ id: string }>();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadTicket = async () => {
      const id = Number(params.id);

      if (Number.isNaN(id)) {
        return;
      }

      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUserId(user?.id ?? null);

        const data = await getTicketById(id);

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

  const canEdit = ticket.created_by === userId && ticket.status === "pending";

  return (
    <main>
      <h1>{ticket.title}</h1>

      <p>Raised by: {ticket.creator.display_name}</p>
      <p>Team: {ticket.team.name}</p>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>

      <p>Ticket owner: {ticket.created_by}</p>
      <p>Current user: {userId}</p>
      <p>Ticket status: {ticket.status}</p>

      {canEdit && <button type="button">Edit ticket</button>}

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
