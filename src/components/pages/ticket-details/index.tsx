"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { getTicketById } from "@/api/tickets";

export default function TicketDetails() {
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const ticket = await getTicketById(Number(params.id));

        console.log("Ticket:", ticket);
      } catch (error) {
        console.error("Failed to load ticket:", error);
      }
    };

    loadTicket();
  }, [params.id]);

  return (
    <main>
      <h1>Ticket details</h1>
    </main>
  );
}
