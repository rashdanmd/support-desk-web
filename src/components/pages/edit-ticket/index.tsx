"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { getTicketById, updateTicket } from "@/api/tickets";
import { getTeams } from "@/api/teams";
import type { Team } from "@/api/teams";
import type { Ticket } from "@/api/tickets/types";
import {
  Alert,
  Button,
  ButtonLink,
  CodeTextarea,
  FieldHint,
  FieldRow,
  Form,
  FormActions,
  FormCard,
  Message,
  NarrowPage,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui";

type EditTicketFormData = {
  title: string;
  description: string;
  teamId: number;
  affectedUrl: string;
  curl: string;
  priority: "low" | "medium" | "high" | "urgent";
};

export default function EditTicket() {
  const params = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [updateError, setUpdateError] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);

  const router = useRouter();
  const { register, reset, handleSubmit } = useForm<EditTicketFormData>();

  useEffect(() => {
    const loadTicket = async () => {
      const id = Number(params.id);

      if (Number.isNaN(id)) {
        return;
      }

      try {
        const data = await getTicketById(id);
        setTicket(data);

        reset({
          title: data.title,
          description: data.description,
          teamId: data.team_id,
          affectedUrl: data.affected_url ?? "",
          curl: data.curl ?? "",
          priority: data.priority,
        });
      } catch (error) {
        console.error("Failed to load ticket:", error);
      }
    };

    loadTicket();
  }, [params.id, reset]);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (error) {
        console.error("Failed to load teams:", error);
      }
    };

    loadTeams();
  }, []);

  if (!ticket) {
    return (
      <NarrowPage>
        <Message>Loading ticket…</Message>
      </NarrowPage>
    );
  }

  const onSubmit = async (data: EditTicketFormData) => {
    const id = Number(params.id);

    if (Number.isNaN(id)) {
      return;
    }

    try {
      await updateTicket(id, data);

      router.push("/my-tickets");
    } catch (error) {
      console.error("Failed to update ticket:", error);
      setUpdateError("Unable to update ticket.");
    }
  };

  return (
    <NarrowPage>
      <PageHeader>
        <div>
          <PageTitle>Edit ticket</PageTitle>
          <PageDescription>
            #{ticket.id} · {ticket.title}
          </PageDescription>
        </div>
      </PageHeader>

      {updateError && <Alert role="alert">{updateError}</Alert>}

      <FormCard>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" type="text" {...register("title")} />
          </div>

          <FieldRow>
            <div>
              <label htmlFor="teamId">Team</label>

              <select
                id="teamId"
                {...register("teamId", {
                  valueAsNumber: true,
                })}
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority">Priority</label>
              <select id="priority" {...register("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </FieldRow>

          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" {...register("description")} />
          </div>

          <div>
            <label htmlFor="affectedUrl">
              Affected URL<FieldHint>Optional</FieldHint>
            </label>
            <input id="affectedUrl" type="text" {...register("affectedUrl")} />
          </div>

          <div>
            <label htmlFor="curl">
              cURL<FieldHint>Optional</FieldHint>
            </label>
            <CodeTextarea id="curl" {...register("curl")} />
          </div>

          <FormActions>
            <ButtonLink href="/my-tickets">Cancel</ButtonLink>
            <Button type="submit" $variant="primary">
              Save changes
            </Button>
          </FormActions>
        </Form>
      </FormCard>
    </NarrowPage>
  );
}
