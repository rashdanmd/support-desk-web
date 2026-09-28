"use client";

import { useEffect, useState } from "react";

import { cancelTicket, getTickets } from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";
import ConfirmDialog from "@/components/confirm-dialog";
import TicketList from "@/components/ticket-list";
import TicketPane, { useTicketPane } from "@/components/ticket-pane";
import {
  Alert,
  Button,
  ButtonLink,
  EmptyState,
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export default function MyTickets() {
  const { selectedId, openTicket, closeTicket } = useTicketPane();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleCancel = async () => {
    if (cancelId === null) {
      return;
    }

    setIsCancelling(true);

    try {
      const cancelledTicket = await cancelTicket(cancelId);

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === cancelId ? cancelledTicket : ticket,
        ),
      );
      setCancelId(null);
    } catch (error) {
      console.error("Failed to cancel ticket:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Page>
        <PageHeader>
          <div>
            <PageTitle>My tickets</PageTitle>
            <PageDescription>
              Requests you&apos;ve raised with the help team.
            </PageDescription>
          </div>
        </PageHeader>

        {loadError && <Alert role="alert">{loadError}</Alert>}

        {isLoading ? (
          <EmptyState>Loading your tickets…</EmptyState>
        ) : tickets.length === 0 ? (
          <EmptyState>You have not raised any tickets yet.</EmptyState>
        ) : (
          <TicketList
            tickets={tickets}
            onOpen={openTicket}
            showCreator={false}
            renderActions={(ticket) =>
              ticket.status === "pending" && (
                <>
                  <ButtonLink href={`/tickets/${ticket.id}/edit`} $size="sm">
                    Edit
                  </ButtonLink>
                  <Button
                    type="button"
                    $size="sm"
                    $variant="ghost"
                    onClick={() => setCancelId(ticket.id)}
                  >
                    Cancel
                  </Button>
                </>
              )
            }
          />
        )}
      </Page>

      <ConfirmDialog
        open={cancelId !== null}
        title="Cancel this ticket?"
        description="This withdraws the request from the help team."
        confirmLabel="Cancel ticket"
        pendingLabel="Cancelling…"
        cancelLabel="Keep ticket"
        tone="danger"
        pending={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />

      <TicketPane
        key={selectedId ?? "closed"}
        ticketId={selectedId}
        onClose={handleClose}
      />
    </>
  );
}
