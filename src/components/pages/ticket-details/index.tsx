"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import {
  cancelTicket,
  deleteTicket,
  getTicketById,
  referTicket,
  resolveTicket,
  startTicketReview,
} from "@/api/tickets";
import type { Ticket } from "@/api/tickets/types";
import { getCurrentUser, type CurrentUser } from "@/api/users";
import TicketResponses from "./components/ticket-responses";

type ReferralFormData = {
  message: string;
};

type ResolutionFormData = {
  resolution: string;
};

type TicketDetailsProps = {
  ticketId: number;
  onClose: () => void;
};

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h1 {
    font-size: 22px;
    font-weight: 700;
    line-height: 28px;
  }

  h2 {
    margin-top: 8px;
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
  }

  p,
  label {
    font-size: 14px;
    line-height: 20px;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid color-mix(in srgb, var(--foreground) 24%, transparent);
    border-radius: 8px;
    background: var(--background);
    color: inherit;
    font-size: 16px;
    line-height: 24px;
  }

  textarea {
    min-height: 96px;
  }

  a,
  button {
    width: fit-content;
    min-height: 40px;
    padding: 8px 16px;
    border: 1px solid color-mix(in srgb, var(--foreground) 24%, transparent);
    border-radius: 8px;
    background: var(--foreground);
    color: var(--background);
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
  }

  a {
    display: inline-flex;
    align-items: center;
  }

  pre {
    font-size: 13px;
    line-height: 18px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export default function TicketDetails({
  ticketId,
  onClose,
}: TicketDetailsProps) {
  const { register, handleSubmit, reset } = useForm<ReferralFormData>();
  const {
    register: registerResolution,
    handleSubmit: handleResolutionSubmit,
    reset: resetResolution,
  } = useForm<ResolutionFormData>();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        const data = await getTicketById(ticketId);
        setTicket(data);
      } catch (error) {
        console.error("Failed to load ticket:", error);
      }
    };

    loadTicket();
  }, [ticketId]);

  if (!ticket) {
    return <p>Loading ticket...</p>;
  }

  const handleDelete = async () => {
    if (!ticket) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this ticket?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTicket(ticket.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  const canManage =
    ticket.created_by === currentUser?.id && ticket.status === "pending";

  const canStartReview =
    (currentUser?.role === "support" || currentUser?.role === "admin") &&
    ticket.status === "pending";

  const canRefer =
    (currentUser?.role === "support" || currentUser?.role === "admin") &&
    ticket.status === "in_review";

  const canDelete = currentUser?.role === "admin";

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this ticket?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const cancelledTicket = await cancelTicket(ticket.id);

      setTicket(cancelledTicket);
    } catch (error) {
      console.error("Failed to cancel ticket:", error);
    }
  };

  const handleStartReview = async () => {
    if (!ticket) {
      return;
    }

    try {
      const updatedTicket = await startTicketReview(ticket.id);

      setTicket(updatedTicket);
    } catch (error) {
      console.error("Failed to start ticket review:", error);
    }
  };

  const handleRefer = async (data: ReferralFormData) => {
    if (!ticket) {
      return;
    }

    try {
      const updatedTicket = await referTicket(ticket.id, data);

      setTicket(updatedTicket);
      reset();
    } catch (error) {
      console.error("Failed to refer ticket:", error);
    }
  };

  const handleResolve = async (data: ResolutionFormData) => {
    if (!ticket) {
      return;
    }

    try {
      const updatedTicket = await resolveTicket(ticket.id, data);

      setTicket(updatedTicket);
      resetResolution();
    } catch (error) {
      console.error("Failed to resolve ticket:", error);
    }
  };

  return (
    <Details>
      <h1>{ticket.title}</h1>

      <p>Raised by: {ticket.creator.display_name}</p>
      <p>Team: {ticket.team.name}</p>
      {ticket.resolution && (
        <div>
          <h2>Resolution</h2>
          <p>{ticket.resolution}</p>
        </div>
      )}
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <h2>Description</h2>
      <p>{ticket.description}</p>
      {ticket.affected_url && (
        <>
          <h2>Affected URL</h2>
          <p>{ticket.affected_url}</p>
        </>
      )}
      {ticket.curl && (
        <>
          <h2>cURL</h2>
          <pre>{ticket.curl}</pre>
        </>
      )}
      {canManage && (
        <>
          <Link href={`/tickets/${ticket.id}/edit`}>Edit ticket</Link>

          <button type="button" onClick={handleCancel}>
            Cancel ticket
          </button>
        </>
      )}
      {canStartReview && (
        <button type="button" onClick={handleStartReview}>
          Start review
        </button>
      )}

      {canRefer && (
        <form onSubmit={handleSubmit(handleRefer)}>
          <div>
            <label htmlFor="referral-message">Referral message</label>

            <textarea
              id="referral-message"
              {...register("message", {
                required: true,
              })}
            />
          </div>

          <button type="submit">Refer ticket</button>
        </form>
      )}

      {canRefer && (
        <form onSubmit={handleResolutionSubmit(handleResolve)}>
          <div>
            <label htmlFor="resolution">Resolution</label>

            <textarea
              id="resolution"
              {...registerResolution("resolution", {
                required: true,
              })}
            />
          </div>

          <button type="submit">Resolve ticket</button>
        </form>
      )}

      {canDelete && (
        <button type="button" onClick={handleDelete}>
          Delete ticket
        </button>
      )}

      <TicketResponses
        ticketId={ticket.id}
        canRespond={
          ticket.created_by === currentUser?.id ||
          currentUser?.role === "support" ||
          currentUser?.role === "admin"
        }
      />
    </Details>
  );
}
