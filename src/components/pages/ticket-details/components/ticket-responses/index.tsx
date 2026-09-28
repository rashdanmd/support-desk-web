"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  createTicketResponse,
  getTicketResponses,
  type TicketResponse,
} from "@/api/responses";
import {
  Button,
  FormActions,
  Message,
  Section,
  SectionTitle,
} from "@/components/ui";
import { formatDateTime } from "@/lib/format";

import {
  Author,
  Composer,
  ResponseBody,
  ResponseHeader,
  ResponseItem,
  ResponseList,
  Timestamp,
} from "./styles";

type ResponseFormData = {
  message: string;
};

type TicketResponsesProps = {
  ticketId: number;
  canRespond: boolean;
};

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
