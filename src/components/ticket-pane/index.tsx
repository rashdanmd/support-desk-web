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
  background: rgba(0, 0, 0, 0.4);
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
  background: var(--background);
  color: var(--foreground);
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.12);
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
    width: 480px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  padding: 12px 16px;
  border-bottom: 1px solid
    color-mix(in srgb, var(--foreground) 16%, transparent);
`;

const CloseButton = styled.button`
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

const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

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
          <CloseButton ref={closeButtonRef} type="button" onClick={requestClose}>
            Close
          </CloseButton>
        </PanelHeader>
        <PanelBody>
          <TicketDetails ticketId={ticketId} onClose={requestClose} />
        </PanelBody>
      </Panel>
    </>
  );
}
