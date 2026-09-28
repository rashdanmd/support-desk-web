"use client";

import styled from "styled-components";

import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const FullWidthButton = styled(Button)`
  width: 100%;
`;

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
