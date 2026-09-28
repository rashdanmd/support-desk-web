import { redirect } from "next/navigation";

import AppShell from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return <AppShell>{children}</AppShell>;
}
