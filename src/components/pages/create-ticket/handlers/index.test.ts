// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

const createTicket = vi.hoisted(() => vi.fn());

vi.mock("@/api/tickets", () => ({
  createTicket,
}));

import { createTicketFromForm } from "./index";

function formControl(form: HTMLFormElement, name: string, value: string) {
  const input = document.createElement("input");
  input.name = name;
  input.value = value;
  form.append(input);
}

describe("createTicketFromForm", () => {
  it("maps form fields into the create-ticket payload", async () => {
    const created = { id: 4 };
    createTicket.mockResolvedValue(created);

    const form = document.createElement("form");
    formControl(form, "title", "Login fails");
    formControl(form, "description", "The form returns 500");
    formControl(form, "team", "2");
    formControl(form, "affectedUrl", "https://app.example/login");
    formControl(form, "curl", "curl https://app.example/login");
    formControl(form, "priority", "high");

    await expect(createTicketFromForm(form)).resolves.toBe(created);
    expect(createTicket).toHaveBeenCalledWith({
      title: "Login fails",
      description: "The form returns 500",
      teamId: 2,
      affectedUrl: "https://app.example/login",
      curl: "curl https://app.example/login",
      priority: "high",
    });
  });
});
