"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out failed:", error.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <button type="button" role="menuitem" onClick={handleSignOut}>
      Sign out
    </button>
  );
}
