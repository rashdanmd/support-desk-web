"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getTickets } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getTickets();
        console.log("Tickets loaded:", data);
        setTickets(data);
      } catch (error) {
        console.error("Failed to load tickets:", error);
      }
    };

    loadTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const search = searchTerm.toLowerCase();

    return (
      ticket.title.toLowerCase().includes(search) ||
      ticket.description.toLowerCase().includes(search) ||
      ticket.team.name.toLowerCase().includes(search) ||
      ticket.status.toLowerCase().includes(search) ||
      ticket.priority.toLowerCase().includes(search) ||
      ticket.creator.display_name.toLowerCase().includes(search)
    );
  });

  return (
    <main>
      <h1>Support requests</h1>

      <input
        type="search"
        placeholder="Search support requests"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      {filteredTickets.map((ticket) => (
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
