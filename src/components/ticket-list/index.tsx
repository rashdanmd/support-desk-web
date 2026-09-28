"use client";

import type { ReactNode } from "react";

import type { Ticket } from "@/api/tickets/types";
import { PriorityBadge, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/format";

import {
  Actions,
  Aside,
  Badges,
  Description,
  List,
  Meta,
  OpenButton,
  Row,
  TicketId,
  Title,
} from "./styles";

type TicketListProps = {
  tickets: Ticket[];
  onOpen: (id: number) => void;
  renderActions?: (ticket: Ticket) => ReactNode;
  showCreator?: boolean;
};

export default function TicketList({
  tickets,
  onOpen,
  renderActions,
  showCreator = true,
}: TicketListProps) {
  return (
    <List>
      {tickets.map((ticket) => {
        const actions = renderActions?.(ticket);

        return (
          <Row key={ticket.id}>
            <OpenButton type="button" onClick={() => onOpen(ticket.id)}>
              <Title>{ticket.title}</Title>
              {ticket.description && (
                <Description>{ticket.description}</Description>
              )}
              <Meta>
                <TicketId>#{ticket.id}</TicketId>
                <span>{ticket.team.name}</span>
                {showCreator && <span>{ticket.creator.display_name}</span>}
                <span>{formatDate(ticket.created_at)}</span>
              </Meta>
            </OpenButton>

            <Aside>
              <Badges>
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </Badges>
              {actions && <Actions>{actions}</Actions>}
            </Aside>
          </Row>
        );
      })}
    </List>
  );
}
