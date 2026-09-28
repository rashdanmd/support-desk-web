"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

import TicketDetails from "@/components/pages/ticket-details";

const Backdrop = styled.button<{ $closing: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  border: 0;
  padding: 0;
  background: rgba(24, 24, 27, 0.24);
  opacity: ${({ $closing }) => ($closing ? 0 : 1)};
  animation: ${({ $closing }) => ($closing ? "none" : "fade-in 240ms ease")};
  transition: ${({ $closing }) => ($closing ? "opacity 240ms ease" : "none")};

  @keyframes fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

const Panel = styled.aside<{ $closing: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 21;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--color-surface);
  color: var(--color-text);
  border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-popover);
  transform: translateX(${({ $closing }) => ($closing ? "100%" : "0")});
  animation: ${({ $closing }) => ($closing ? "none" : "slide-in 240ms ease")};
  transition: ${({ $closing }) =>
    $closing ? "transform 240ms ease" : "none"};

  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }

  @media (min-width: 768px) {
    width: 560px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  border-bottom: 1px solid var(--color-border);
`;

const PanelTitle = styled.p`
  color: var(--color-text-subtle);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 18px;
`;

const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-subtle);
  transition:
    background-color 120ms ease,
    color 120ms ease;

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }
`;

const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

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
