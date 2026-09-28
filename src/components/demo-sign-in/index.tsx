"use client";

import { useFormStatus } from "react-dom";

import { Alert } from "@/components/ui";

import { DemoForm, FullWidthButton, Hint } from "./styles";

type DemoSignInProps = {
  unavailable?: boolean;
};

function DemoButton() {
  const { pending } = useFormStatus();

  return (
    <FullWidthButton type="submit" disabled={pending}>
      {pending ? "Opening demo…" : "Explore demo"}
    </FullWidthButton>
  );
}

export default function DemoSignIn({ unavailable = false }: DemoSignInProps) {
  return (
    <DemoForm action="/auth/demo" method="post">
      {unavailable && (
        <Alert role="alert">Demo sign-in is not available right now.</Alert>
      )}

      <DemoButton />
      <Hint>No account or password required.</Hint>
    </DemoForm>
  );
}
