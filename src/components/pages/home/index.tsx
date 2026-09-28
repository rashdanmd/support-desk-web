import { Suspense } from "react";

import AppShell from "@/components/app-shell";
import Auth from "@/components/pages/auth";
import { createClient } from "@/lib/supabase/server";

import TicketBoard from "./ticket-board";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Auth />;
  }

  const name = user.user_metadata.full_name ?? user.email ?? "there";

  return (
    <AppShell>
      <Suspense fallback={<p>Loading tickets...</p>}>
        <TicketBoard name={name} />
      </Suspense>
    </AppShell>
  );
}
