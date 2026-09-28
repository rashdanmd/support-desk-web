"use client";

import styled from "styled-components";

export const Backdrop = styled.button<{ $closing: boolean }>`
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

export const Panel = styled.aside<{ $closing: boolean }>`
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

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  border-bottom: 1px solid var(--color-border);
`;

export const PanelTitle = styled.p`
  color: var(--color-text-subtle);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 18px;
`;

export const CloseButton = styled.button`
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

export const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;
