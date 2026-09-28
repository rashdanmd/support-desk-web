"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import {
  createTicketResponse,
  getTicketResponses,
  type TicketResponse,
} from "@/api/responses";
import {
  Button,
  Form,
  FormActions,
  Message,
  Section,
  SectionTitle,
} from "@/components/ui";
import { formatDateTime } from "@/lib/format";

type ResponseFormData = {
  message: string;
};

type TicketResponsesProps = {
  ticketId: number;
  canRespond: boolean;
};

const ResponseList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResponseItem = styled.li`
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
`;

const ResponseHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
`;

const Author = styled.span`
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
`;

const Timestamp = styled.time`
  color: var(--color-text-subtle);
  font-size: 12px;
  line-height: 16px;
`;

const ResponseBody = styled.p`
  color: var(--color-text);
  font-size: 14px;
  line-height: 22px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Composer = styled(Form)`
  margin-top: 8px;
`;

export default function TicketResponses({
  ticketId,
  canRespond,
}: TicketResponsesProps) {
  const [responses, setResponses] = useState<TicketResponse[]>([]);

  const { register, handleSubmit, reset } = useForm<ResponseFormData>();

  useEffect(() => {
    const loadResponses = async () => {
      try {
        const data = await getTicketResponses(ticketId);

        setResponses(data);
      } catch (error) {
        console.error("Failed to load ticket responses:", error);
      }
    };

    loadResponses();
  }, [ticketId]);

  const onSubmit = async (data: ResponseFormData) => {
    try {
      const newResponse = await createTicketResponse(ticketId, data);

      setResponses((currentResponses) => [...currentResponses, newResponse]);

      reset();
    } catch (error) {
      console.error("Failed to create response:", error);
    }
  };

  return (
    <Section>
      <SectionTitle>Responses</SectionTitle>

      {responses.length === 0 ? (
        <Message>No responses yet.</Message>
      ) : (
        <ResponseList>
          {responses.map((response) => (
            <ResponseItem key={response.id}>
              <ResponseHeader>
                <Author>{response.author.display_name}</Author>
                <Timestamp dateTime={response.created_at}>
                  {formatDateTime(response.created_at)}
                </Timestamp>
              </ResponseHeader>
              <ResponseBody>{response.message}</ResponseBody>
            </ResponseItem>
          ))}
        </ResponseList>
      )}

      {canRespond && (
        <Composer onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="message">Add response</label>
            <textarea
              id="message"
              placeholder="Write a reply"
              {...register("message", {
                required: true,
              })}
            />
          </div>

          <FormActions>
            <Button type="submit" $variant="primary">
              Send response
            </Button>
          </FormActions>
        </Composer>
      )}
    </Section>
  );
}
