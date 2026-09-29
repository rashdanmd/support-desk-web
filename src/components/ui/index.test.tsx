import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PriorityBadge, StatusBadge } from "./index";

describe("badges", () => {
  it("labels a ticket status and priority", () => {
    render(
      <>
        <StatusBadge status="in_review" />
        <PriorityBadge priority="urgent" />
      </>,
    );

    expect(screen.getByText("In review")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });
});
