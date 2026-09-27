"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getTickets } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getTickets();

        setTickets(data);
      } catch (error) {
        console.error("Failed to load tickets:", error);
      }
    };

    loadTickets();
  }, []);

  return (
    <main>
      <h1>Support requests</h1>
      {tickets.map((ticket) => (
        <div key={ticket.id}>
          <h2>
            <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
          </h2>

          <p>{ticket.description}</p>

          <p>Raised by: {ticket.creator.display_name}</p>
          <p>Team: {ticket.team.name}</p>
          <p>Status: {ticket.status}</p>
          <p>Priority: {ticket.priority}</p>
        </div>
      ))}
    </main>
  );
}
