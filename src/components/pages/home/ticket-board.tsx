"use client";

import { useEffect, useMemo, useState } from "react";

import { getTickets } from "@/api/tickets";
import type { Ticket, TicketPriority, TicketStatus } from "@/api/tickets/types";
import { getCurrentUser, type CurrentUser } from "@/api/users";
import TicketList from "@/components/ticket-list";
import TicketPane, { useTicketPane } from "@/components/ticket-pane";
import {
  Alert,
  Button,
  EmptyState,
  Page,
  PageHeader,
} from "@/components/ui";

import {
  BoardTitle,
  Filters,
  FilterSelect,
  Greeting,
  Intro,
  Search,
  Summary,
  SummaryButton,
  SummaryHead,
  SummaryLabel,
  SummaryValue,
  Toolbar,
  Welcome,
  type SummaryTone,
} from "./styles";

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_review", label: "In review" },
  { value: "referred", label: "Referred" },
  { value: "resolved", label: "Resolved" },
  { value: "cancelled", label: "Cancelled" },
];

const summaryStatuses: {
  value: TicketStatus;
  label: string;
  tone: SummaryTone;
}[] = [
  { value: "pending", label: "Pending", tone: "pending" },
  { value: "in_review", label: "In review", tone: "in_review" },
  { value: "referred", label: "Referred", tone: "referred" },
  { value: "resolved", label: "Resolved", tone: "resolved" },
  { value: "cancelled", label: "Cancelled", tone: "cancelled" },
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
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    const loadTickets = async () => {
      try {
        const [data, user] = await Promise.all([
          getTickets(),
          getCurrentUser().catch(() => null),
        ]);

        if (!active) {
          return;
        }

        setTickets(data);
        setCurrentUser(user);
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

  const canViewSummary =
    currentUser?.role === "support" || currentUser?.role === "admin";

  const statusCounts = useMemo(
    () =>
      tickets.reduce<Partial<Record<TicketStatus, number>>>((counts, ticket) => {
        counts[ticket.status] = (counts[ticket.status] ?? 0) + 1;
        return counts;
      }, {}),
    [tickets],
  );

  return (
    <>
      <Page>
        <PageHeader>
          <div>
            <BoardTitle>Support requests</BoardTitle>
            <Intro>
              <Greeting>Hello {name}</Greeting>
              <Welcome>Here&apos;s everything raised with the help team.</Welcome>
            </Intro>
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
                aria-label="Search support requests"
                placeholder="Search support requests"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </Search>
          </Toolbar>
        </PageHeader>

        {loadError && <Alert role="alert">{loadError}</Alert>}

        {!isLoading && canViewSummary && tickets.length > 0 && (
          <Summary aria-label="Support request summary">
            {summaryStatuses.map((item) => (
              <SummaryButton
                key={item.value}
                type="button"
                $tone={item.tone}
                $active={statusFilter === item.value}
                aria-pressed={statusFilter === item.value}
                onClick={() =>
                  setStatusFilter((current) =>
                    current === item.value ? "" : item.value,
                  )
                }
              >
                <SummaryHead $tone={item.tone}>
                  <SummaryLabel>{item.label}</SummaryLabel>
                </SummaryHead>
                <SummaryValue>{statusCounts[item.value] ?? 0}</SummaryValue>
              </SummaryButton>
            ))}
            <SummaryButton
              type="button"
              $tone="total"
              $active={!statusFilter}
              aria-pressed={!statusFilter}
              onClick={() => setStatusFilter("")}
            >
              <SummaryHead $tone="total">
                <SummaryLabel>Total</SummaryLabel>
              </SummaryHead>
              <SummaryValue>{tickets.length}</SummaryValue>
            </SummaryButton>
          </Summary>
        )}

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
