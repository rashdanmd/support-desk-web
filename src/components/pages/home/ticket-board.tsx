"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

import { getTickets } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";
import TicketList from "@/components/ticket-list";
import TicketPane, { useTicketPane } from "@/components/ticket-pane";
import {
  Alert,
  EmptyState,
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui";

type TicketBoardProps = {
  name: string;
};

const Search = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 768px) {
    width: 280px;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 12px;
    color: var(--color-text-faint);
    transform: translateY(-50%);
    pointer-events: none;
  }

  input {
    padding-left: 34px;
  }
`;

const Count = styled.span`
  color: var(--color-text-faint);
  font-weight: 400;
`;

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <circle
        cx="7"
        cy="7"
        r="4.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 10.5 14 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
      <Page>
        <PageHeader>
          <div>
            <PageTitle>
              Tickets{" "}
              {!isLoading && tickets.length > 0 && (
                <Count>{tickets.length}</Count>
              )}
            </PageTitle>
            <PageDescription>
              Hello {name}. Here&apos;s everything raised with the help team.
            </PageDescription>
          </div>

          <Search>
            <SearchIcon />
            <input
              type="search"
              aria-label="Search tickets"
              placeholder="Search tickets"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Search>
        </PageHeader>

        {loadError && <Alert role="alert">{loadError}</Alert>}

        {isLoading ? (
          <EmptyState>Loading tickets…</EmptyState>
        ) : filteredTickets.length === 0 ? (
          <EmptyState>
            {searchTerm ? "No tickets match your search." : "No tickets yet."}
          </EmptyState>
        ) : (
          <TicketList tickets={filteredTickets} onOpen={openTicket} />
        )}
      </Page>

      <TicketPane
        key={selectedId ?? "closed"}
        ticketId={selectedId}
        onClose={handleClose}
      />
    </>
  );
}
