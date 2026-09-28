"use client";

import { createClient } from "@/lib/supabase/client";

import { FullWidthButton } from "./styles";

export default function GoogleSignIn() {
  const handleSignIn = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google sign in failed:", error.message);
    }
  };

  return (
    <FullWidthButton type="button" onClick={handleSignIn}>
      Continue with Google
    </FullWidthButton>
  );
}
