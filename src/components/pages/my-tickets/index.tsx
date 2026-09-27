"use client";
import { useEffect, useState } from "react";
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

      {tickets.map((ticket) => (
        <>
          <p key={ticket.id}>{ticket.title}</p>
          <p>Created by: {ticket.created_by}</p>
        </>
      ))}
    </main>
  );
}
