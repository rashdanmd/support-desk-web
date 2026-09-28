"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TicketDetails from "@/components/pages/ticket-details";

import {
  Backdrop,
  CloseButton,
  Panel,
  PanelBody,
  PanelHeader,
  PanelTitle,
} from "./styles";

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type TicketPaneProps = {
  ticketId: number | null;
  onClose: () => void;
};

export function useTicketPane() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ticketParam = searchParams.get("ticket");
  const parsedTicketId = ticketParam ? Number(ticketParam) : null;
  const selectedId =
    parsedTicketId != null &&
    Number.isInteger(parsedTicketId) &&
    parsedTicketId > 0
      ? parsedTicketId
      : null;

  const openTicket = useCallback(
    (id: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("ticket", String(id));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const closeTicket = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("ticket");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return { selectedId, openTicket, closeTicket };
}

export default function TicketPane({ ticketId, onClose }: TicketPaneProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (ticketId == null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsClosing(true);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ticketId]);

  if (ticketId == null) {
    return null;
  }

  const requestClose = () => {
    setIsClosing(true);
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (
      event.target === event.currentTarget &&
      event.propertyName === "transform" &&
      isClosing
    ) {
      onClose();
    }
  };

  return (
    <>
      <Backdrop
        type="button"
        aria-label="Close ticket details"
        $closing={isClosing}
        onClick={requestClose}
      />
      <Panel
        $closing={isClosing}
        role="dialog"
        aria-modal="true"
        aria-label="Ticket details"
        onTransitionEnd={handleTransitionEnd}
      >
        <PanelHeader>
          <PanelTitle>Ticket #{ticketId}</PanelTitle>
          <CloseButton
            ref={closeButtonRef}
            type="button"
            aria-label="Close"
            onClick={requestClose}
          >
            <CloseIcon />
          </CloseButton>
        </PanelHeader>
        <PanelBody>
          <TicketDetails ticketId={ticketId} onClose={requestClose} />
        </PanelBody>
      </Panel>
    </>
  );
}
