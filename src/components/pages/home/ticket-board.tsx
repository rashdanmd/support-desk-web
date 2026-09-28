"use client";

import { useEffect, useMemo, useState } from "react";

import { getTickets } from "@/api/tickets";
import type { Ticket, TicketPriority, TicketStatus } from "@/api/tickets/types";
import TicketList from "@/components/ticket-list";
import TicketPane, { useTicketPane } from "@/components/ticket-pane";
import {
  Alert,
  Button,
  EmptyState,
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui";

import { Count, Filters, FilterSelect, Search, Toolbar } from "./styles";

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_review", label: "In review" },
  { value: "referred", label: "Referred" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
];

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

type TicketBoardProps = {
  name: string;
};

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
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "">("");
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

  const filteredTickets = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return tickets.filter((ticket) => {
      if (statusFilter && ticket.status !== statusFilter) {
        return false;
      }

      if (priorityFilter && ticket.priority !== priorityFilter) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        ticket.title.toLowerCase().includes(search) ||
        ticket.description.toLowerCase().includes(search) ||
        ticket.team.name.toLowerCase().includes(search) ||
        ticket.status.toLowerCase().includes(search) ||
        ticket.priority.toLowerCase().includes(search) ||
        ticket.creator.display_name.toLowerCase().includes(search)
      );
    });
  }, [priorityFilter, searchTerm, statusFilter, tickets]);

  const filtersActive = Boolean(
    statusFilter || priorityFilter || searchTerm.trim(),
  );

  const clearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setSearchTerm("");
  };

  return (
    <>
      <Page>
        <PageHeader>
          <div>
            <PageTitle>
              Tickets{" "}
              {!isLoading && tickets.length > 0 && (
                <Count>
                  {filteredTickets.length === tickets.length
                    ? tickets.length
                    : `${filteredTickets.length} of ${tickets.length}`}
                </Count>
              )}
            </PageTitle>
            <PageDescription>
              Hello {name}. Here&apos;s everything raised with the help team.
            </PageDescription>
          </div>

          <Toolbar>
            {!isLoading && tickets.length > 0 && (
              <Filters role="group" aria-label="Filter tickets">
                <FilterSelect
                  aria-label="Status"
                  value={statusFilter}
                  data-active={statusFilter ? "true" : undefined}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as TicketStatus | "")
                  }
                >
                  <option value="">Status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FilterSelect>

                <FilterSelect
                  aria-label="Priority"
                  value={priorityFilter}
                  data-active={priorityFilter ? "true" : undefined}
                  onChange={(event) =>
                    setPriorityFilter(event.target.value as TicketPriority | "")
                  }
                >
                  <option value="">Priority</option>
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FilterSelect>

                {filtersActive && (
                  <Button
                    type="button"
                    $variant="ghost"
                    $size="sm"
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                )}
              </Filters>
            )}

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
          </Toolbar>
        </PageHeader>

        {loadError && <Alert role="alert">{loadError}</Alert>}

        {isLoading ? (
          <EmptyState>Loading tickets…</EmptyState>
        ) : filteredTickets.length === 0 ? (
          <EmptyState>
            {filtersActive
              ? "No tickets match these filters."
              : "No tickets yet."}
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
