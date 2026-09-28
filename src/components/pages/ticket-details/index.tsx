"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import ConfirmDialog from "@/components/confirm-dialog";
import {
  Button,
  ButtonLink,
  Form,
  FormActions,
  Message,
  PriorityBadge,
  Section,
  SectionTitle,
  StatusBadge,
} from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import TicketResponses from "./components/ticket-responses";

import {
  Actions,
  Badges,
  Body,
  Callout,
  Code,
  Details,
  Header,
  MetaList,
  Mono,
  Panel,
  Title,
} from "./styles";

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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

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
    return <Message>Loading ticket…</Message>;
  }

  const handleDelete = async () => {
    if (!ticket) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTicket(ticket.id);
      setConfirmDelete(false);
      onClose();
    } catch (error) {
      console.error("Failed to delete ticket:", error);
      setIsDeleting(false);
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
    setIsCancelling(true);

    try {
      const cancelledTicket = await cancelTicket(ticket.id);

      setTicket(cancelledTicket);
      setConfirmCancel(false);
    } catch (error) {
      console.error("Failed to cancel ticket:", error);
    } finally {
      setIsCancelling(false);
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
      <Header>
        <Title>{ticket.title}</Title>
        <Badges>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </Badges>
      </Header>

      <MetaList>
        <dt>Raised by</dt>
        <dd>{ticket.creator.display_name}</dd>
        <dt>Team</dt>
        <dd>{ticket.team.name}</dd>
        <dt>Created</dt>
        <dd>{formatDateTime(ticket.created_at)}</dd>
        {ticket.updated_at !== ticket.created_at && (
          <>
            <dt>Updated</dt>
            <dd>{formatDateTime(ticket.updated_at)}</dd>
          </>
        )}
      </MetaList>

      {(canManage || canStartReview || canDelete) && (
        <Actions>
          {canStartReview && (
            <Button type="button" $variant="primary" onClick={handleStartReview}>
              Start review
            </Button>
          )}
          {canManage && (
            <>
              <ButtonLink href={`/tickets/${ticket.id}/edit`}>
                Edit ticket
              </ButtonLink>
              <Button type="button" onClick={() => setConfirmCancel(true)}>
                Cancel ticket
              </Button>
            </>
          )}
          {canDelete && (
            <Button
              type="button"
              $variant="danger"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          )}
        </Actions>
      )}

      {ticket.resolution && (
        <Callout>
          <SectionTitle>Resolution</SectionTitle>
          <Body>{ticket.resolution}</Body>
        </Callout>
      )}

      <Section>
        <SectionTitle>Description</SectionTitle>
        <Body>{ticket.description}</Body>
      </Section>

      {ticket.affected_url && (
        <Section>
          <SectionTitle>Affected URL</SectionTitle>
          <Mono>{ticket.affected_url}</Mono>
        </Section>
      )}

      {ticket.curl && (
        <Section>
          <SectionTitle>cURL</SectionTitle>
          <Code>{ticket.curl}</Code>
        </Section>
      )}

      {canRefer && (
        <Panel>
          <Form onSubmit={handleSubmit(handleRefer)}>
            <div>
              <label htmlFor="referral-message">Refer ticket</label>
              <textarea
                id="referral-message"
                placeholder="Explain why this ticket is being referred"
                {...register("message", {
                  required: true,
                })}
              />
            </div>

            <FormActions>
              <Button type="submit">Refer ticket</Button>
            </FormActions>
          </Form>
        </Panel>
      )}

      {canRefer && (
        <Panel>
          <Form onSubmit={handleResolutionSubmit(handleResolve)}>
            <div>
              <label htmlFor="resolution">Resolve ticket</label>
              <textarea
                id="resolution"
                placeholder="Describe how the issue was resolved"
                {...registerResolution("resolution", {
                  required: true,
                })}
              />
            </div>

            <FormActions>
              <Button type="submit" $variant="primary">
                Resolve ticket
              </Button>
            </FormActions>
          </Form>
        </Panel>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this ticket?"
        description="This permanently removes the ticket. You cannot undo this."
        confirmLabel="Delete ticket"
        pendingLabel="Deleting…"
        tone="danger"
        pending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel this ticket?"
        description="This withdraws the request from the help team."
        confirmLabel="Cancel ticket"
        pendingLabel="Cancelling…"
        cancelLabel="Keep ticket"
        tone="danger"
        pending={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
      />

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
