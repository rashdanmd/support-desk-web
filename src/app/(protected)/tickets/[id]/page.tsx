import { redirect } from "next/navigation";

export default async function TicketPage({
  params,
}: PageProps<"/tickets/[id]">) {
  const { id } = await params;

  redirect(`/?ticket=${id}`);
}
