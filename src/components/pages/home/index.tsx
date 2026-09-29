import { Suspense } from "react";

import AppShell from "@/components/app-shell";
import Auth from "@/components/pages/auth";
import { isDemoEnabled } from "@/lib/demo";
import { greetingName } from "@/lib/greeting";
import { createClient } from "@/lib/supabase/server";

import TicketBoard from "./ticket-board";

type HomeProps = {
  searchParams: Promise<{ demo?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const demoEnabled = isDemoEnabled();

    return (
      <Auth
        demoEnabled={demoEnabled}
        demoUnavailable={demoEnabled && params.demo === "unavailable"}
      />
    );
  }

  const name = greetingName(user);

  return (
    <AppShell>
      <Suspense fallback={<p>Loading tickets...</p>}>
        <TicketBoard name={name} />
      </Suspense>
    </AppShell>
  );
}
