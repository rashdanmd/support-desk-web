import { createTicket } from "@/api/tickets";

export const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  try {
    const ticket = await createTicket({
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

    console.log("Ticket created:", ticket);
  } catch (error) {
    console.error("Failed to create ticket:", error);
  }
};
