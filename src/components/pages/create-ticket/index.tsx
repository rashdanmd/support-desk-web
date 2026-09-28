"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getTeams, type Team } from "@/api/teams";
import ConfirmDialog from "@/components/confirm-dialog";
import {
  Button,
  ButtonLink,
  CodeTextarea,
  FieldHint,
  FieldRow,
  Form,
  FormActions,
  FormCard,
  NarrowPage,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui";
import { createTicketFromForm } from "./handlers";

export default function CreateTicket() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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

  const requestCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmOpen(true);
  };

  const confirmCreate = async () => {
    if (!formRef.current) {
      return;
    }

    setIsCreating(true);

    try {
      await createTicketFromForm(formRef.current);
      formRef.current.reset();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      setIsCreating(false);
      setConfirmOpen(false);
    }
  };

  return (
    <NarrowPage>
      <PageHeader>
        <div>
          <PageTitle>Create a support request</PageTitle>
          <PageDescription>
            Describe the issue and the help team will pick it up.
          </PageDescription>
        </div>
      </PageHeader>

      <FormCard>
        <Form ref={formRef} onSubmit={requestCreate}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Short summary of the issue"
            />
          </div>

          <FieldRow>
            <div>
              <label htmlFor="team">Team</label>

              <select id="team" name="team">
                <option value="">Select a team</option>

                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" defaultValue="medium">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </FieldRow>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="What happened, and what did you expect to happen?"
            />
          </div>

          <div>
            <label htmlFor="affectedUrl">
              Affected URL<FieldHint>Optional</FieldHint>
            </label>
            <input
              id="affectedUrl"
              name="affectedUrl"
              placeholder="https://"
            />
          </div>

          <div>
            <label htmlFor="curl">
              cURL<FieldHint>Optional</FieldHint>
            </label>
            <CodeTextarea
              id="curl"
              name="curl"
              placeholder="curl https://…"
            />
          </div>

          <FormActions>
            <ButtonLink href="/">Cancel</ButtonLink>
            <Button type="submit" $variant="primary">
              Create ticket
            </Button>
          </FormActions>
        </Form>
      </FormCard>

      <ConfirmDialog
        open={confirmOpen}
        title="Create this ticket?"
        description="This sends the request to the help team."
        confirmLabel="Create ticket"
        pendingLabel="Creating…"
        pending={isCreating}
        onConfirm={confirmCreate}
        onCancel={() => setConfirmOpen(false)}
      />
    </NarrowPage>
  );
}
