"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import { cancelTicket, getTickets } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";
import TicketPane, { useTicketPane } from "@/components/ticket-pane";
import { createClient } from "@/lib/supabase/client";

const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`;

const TicketList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TicketCard = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--foreground) 16%, transparent);
  border-radius: 8px;
`;

const TicketTitle = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  text-align: left;
  cursor: pointer;
`;

const Meta = styled.p`
  font-size: 14px;
  line-height: 20px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 8px 16px;
  border: 1px solid color-mix(in srgb, var(--foreground) 24%, transparent);
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
`;

const ActionButton = styled.button`
  min-height: 40px;
  padding: 8px 16px;
  border: 1px solid color-mix(in srgb, var(--foreground) 24%, transparent);
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
`;

const Message = styled.p`
  font-size: 14px;
  line-height: 20px;
`;

export default function MyTickets() {
  const { selectedId, openTicket, closeTicket } = useTicketPane();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    const loadTickets = async () => {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !active) {
          return;
        }

        const data = await getTickets();

        if (!active) {
          return;
        }

        const userTickets = data.filter(
          (ticket) => ticket.created_by === user.id,
        );

        setTickets(userTickets);
        setLoadError("");
      } catch (error) {
        console.error("Failed to load tickets:", error);

        if (!active) {
          return;
        }

        setLoadError("Unable to load your tickets.");
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
        setLoadError("");
      } catch (error) {
        console.error("Failed to load tickets:", error);
        setLoadError("Unable to load your tickets.");
      }
    };

    refreshTickets();
  };

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
    <>
      <Page>
        <Heading>My tickets</Heading>

        {loadError && <Message role="alert">{loadError}</Message>}

        {isLoading ? (
          <Message>Loading your tickets...</Message>
        ) : tickets.length === 0 ? (
          <Message>You have not raised any tickets yet.</Message>
        ) : (
          <TicketList>
            {tickets.map((ticket) => {
              const canManage = ticket.status === "pending";

              return (
                <TicketCard key={ticket.id}>
                  <TicketTitle
                    type="button"
                    onClick={() => openTicket(ticket.id)}
                  >
                    {ticket.title}
                  </TicketTitle>

                  <Meta>{ticket.description}</Meta>
                  <Meta>Team: {ticket.team.name}</Meta>
                  <Meta>Status: {ticket.status}</Meta>
                  <Meta>Priority: {ticket.priority}</Meta>

                  {canManage && (
                    <Actions>
                      <ActionLink href={`/tickets/${ticket.id}/edit`}>
                        Edit ticket
                      </ActionLink>

                      <ActionButton
                        type="button"
                        onClick={() => handleCancel(ticket.id)}
                      >
                        Cancel ticket
                      </ActionButton>
                    </Actions>
                  )}
                </TicketCard>
              );
            })}
          </TicketList>
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
