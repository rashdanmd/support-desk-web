"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  createTicketResponse,
  getTicketResponses,
  type TicketResponse,
} from "@/api/responses";

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
    <section>
      <h2>Responses</h2>

      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        responses.map((response) => (
          <div key={response.id}>
            <p>
              <strong>{response.author.display_name}</strong>
            </p>

            <p>{response.message}</p>
          </div>
        ))
      )}

      {canRespond && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="message">Add response</label>

            <textarea
              id="message"
              {...register("message", {
                required: true,
              })}
            />
          </div>

          <button type="submit">Send response</button>
        </form>
      )}
    </section>
  );
}
