"use client";

import type { ReactNode } from "react";
import styled from "styled-components";

import type { Ticket } from "@/api/tickets/types";
import { PriorityBadge, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/format";

const List = styled.ul`
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
`;

const Row = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  transition: background-color 120ms ease;

  & + & {
    border-top: 1px solid var(--color-border);
  }

  &:hover {
    background: var(--color-surface-muted);
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 24px;
  }
`;

const OpenButton = styled.button`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible::after {
    border-radius: inherit;
    box-shadow: inset 0 0 0 2px var(--color-accent);
  }
`;

const Title = styled.span`
  display: block;
  overflow: hidden;
  color: var(--color-text);
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Description = styled.span`
  display: block;
  margin-top: 2px;
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 8px;
  color: var(--color-text-subtle);
  font-size: 12px;
  line-height: 16px;

  & > * + *::before {
    content: "·";
    margin-right: 8px;
    color: var(--color-text-faint);
  }
`;

const TicketId = styled.span`
  font-family: var(--font-mono);
  font-size: 12px;
`;

const Aside = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const Badges = styled.div`
  display: flex;
  gap: 6px;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;

  @media (min-width: 768px) {
    margin-left: 8px;
  }
`;

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
