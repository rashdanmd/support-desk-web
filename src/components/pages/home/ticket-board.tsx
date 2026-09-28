"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

import { getTickets } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";
import TicketPane, { useTicketPane } from "@/components/ticket-pane";

type TicketBoardProps = {
  name: string;
};

const Board = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Greeting = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--foreground) 24%, transparent);
  border-radius: 8px;
  background: var(--background);
  color: inherit;
  font-size: 16px;
  line-height: 24px;
`;

const TicketList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TicketCard = styled.button`
  width: 100%;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--foreground) 16%, transparent);
  border-radius: 8px;
  background: var(--background);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: color-mix(in srgb, var(--foreground) 4%, transparent);
  }
`;

const TicketTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
`;

const TicketDescription = styled.p`
  margin-top: 8px;
  font-size: 14px;
  line-height: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TicketMeta = styled.p`
  margin-top: 8px;
  font-size: 13px;
  line-height: 18px;
`;

const Message = styled.p`
  font-size: 14px;
  line-height: 20px;
`;

export default function TicketBoard({ name }: TicketBoardProps) {
  const { selectedId, openTicket, closeTicket } = useTicketPane();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    const loadTickets = async () => {
      try {
        const data = await getTickets();

        if (!active) {
          return;
        }

        setTickets(data);
        setLoadError("");
      } catch (error) {
        console.error("Failed to load tickets:", error);

        if (!active) {
          return;
        }

        setLoadError("Unable to load tickets.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadTickets();

    return () => {
      active = false;
    };
  }, []);

  const handleClose = () => {
    closeTicket();

    const refreshTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
        setLoadError("");
      } catch (error) {
        console.error("Failed to load tickets:", error);
        setLoadError("Unable to load tickets.");
      }
    };

    refreshTickets();
  };

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
    <>
      <Board>
        <Greeting>Hello {name}</Greeting>

        <SearchInput
          type="search"
          aria-label="Search tickets"
          placeholder="Search tickets"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {loadError && <Message role="alert">{loadError}</Message>}

        {isLoading ? (
          <Message>Loading tickets...</Message>
        ) : filteredTickets.length === 0 ? (
          <Message>
            {searchTerm ? "No tickets match your search." : "No tickets yet."}
          </Message>
        ) : (
          <TicketList>
            {filteredTickets.map((ticket) => (
              <li key={ticket.id}>
                <TicketCard
                  type="button"
                  onClick={() => openTicket(ticket.id)}
                >
                  <TicketTitle>{ticket.title}</TicketTitle>
                  <TicketDescription>{ticket.description}</TicketDescription>
                  <TicketMeta>Raised by: {ticket.creator.display_name}</TicketMeta>
                  <TicketMeta>Team: {ticket.team.name}</TicketMeta>
                  <TicketMeta>Status: {ticket.status}</TicketMeta>
                  <TicketMeta>Priority: {ticket.priority}</TicketMeta>
                </TicketCard>
              </li>
            ))}
          </TicketList>
        )}
      </Board>

      <TicketPane
        key={selectedId ?? "closed"}
        ticketId={selectedId}
        onClose={handleClose}
      />
    </>
  );
}
