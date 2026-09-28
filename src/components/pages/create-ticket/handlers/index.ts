import { createTicket } from "@/api/tickets";

export const createTicketFromForm = async (form: HTMLFormElement) => {
  const formData = new FormData(form);

  return createTicket({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    teamId: Number(formData.get("team")),
    affectedUrl: formData.get("affectedUrl") as string,
    curl: formData.get("curl") as string,
    priority: formData.get("priority") as
      | "low"
      | "medium"
      | "high"
      | "urgent",
  });
};
