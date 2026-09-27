"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { cancelTicket, getTickets } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";
import { createClient } from "@/lib/supabase/client";

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const data = await getTickets();

        const userTickets = data.filter(
          (ticket) => ticket.created_by === user.id,
        );

        setTickets(userTickets);
      } catch (error) {
        console.error("Failed to load tickets:", error);
      }
    };

    loadTickets();
  }, []);

  const handleCancel = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this ticket?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const cancelledTicket = await cancelTicket(id);

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === id ? cancelledTicket : ticket,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel ticket:", error);
    }
  };

  return (
    <main>
      <h1>My Tickets</h1>

      {tickets.map((ticket) => {
        const canManage = ticket.status === "pending";

        return (
          <div key={ticket.id}>
            <h2>
              <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
            </h2>

            <p>{ticket.description}</p>
            <p>Team: {ticket.team.name}</p>
            <p>Status: {ticket.status}</p>
            <p>Priority: {ticket.priority}</p>

            {canManage && (
              <>
                <Link href={`/tickets/${ticket.id}/edit`}>Edit ticket</Link>

                <button type="button" onClick={() => handleCancel(ticket.id)}>
                  Cancel ticket
                </button>
              </>
            )}
          </div>
        );
      })}
    </main>
  );
}
