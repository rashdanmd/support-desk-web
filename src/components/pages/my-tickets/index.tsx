"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

import { getTickets } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const loadMyTickets = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const tickets = await getTickets();

      const myTickets = tickets.filter(
        (ticket) => ticket.created_by === user.id,
      );

      setTickets(myTickets);
    };

    loadMyTickets();
  }, []);

  return (
    <main>
      <h1>My tickets</h1>

      {tickets.map((ticket) => {
        const canEdit = ticket.status === "pending";

        return (
          <div key={ticket.id}>
            <h2>
              <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
            </h2>

            <p>{ticket.description}</p>
            <p>Team: {ticket.team.name}</p>
            <p>Status: {ticket.status}</p>
            <p>Priority: {ticket.priority}</p>

            {canEdit && (
              <Link href={`/tickets/${ticket.id}/edit`}>Edit ticket</Link>
            )}
          </div>
        );
      })}
    </main>
  );
}
