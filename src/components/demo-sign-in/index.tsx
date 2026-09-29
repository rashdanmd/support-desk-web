"use client";

import { useFormStatus } from "react-dom";

import { Alert } from "@/components/ui";

import { DemoForm, FullWidthButton, Hint } from "./styles";

type DemoRole = "user" | "support";

type DemoSignInProps = {
  unavailable?: boolean;
};

const buttons: {
  role: DemoRole;
  label: string;
  variant: "primary" | "secondary";
}[] = [
    { role: "user", label: "Explore as user", variant: "primary" },
    { role: "support", label: "Explore as support", variant: "secondary" },
  ];

function DemoButton({
  role,
  label,
  variant,
}: {
  role: DemoRole;
  label: string;
  variant: "primary" | "secondary";
}) {
  const { pending, data } = useFormStatus();
  const submitting = pending && data?.get("role") === role;

  return (
    <FullWidthButton
      type="submit"
      name="role"
      value={role}
      $variant={variant}
      disabled={pending}
    >
      {submitting ? "Opening demo…" : label}
    </FullWidthButton>
  );
}

export default function DemoSignIn({ unavailable = false }: DemoSignInProps) {
  return (
    <DemoForm action="/auth/demo" method="post">
      {unavailable && (
        <Alert role="alert">Demo sign-in is not available right now.</Alert>
      )}

      {buttons.map((button) => (
        <DemoButton key={button.role} {...button} />
      ))}
      <Hint>No account or password required.</Hint>
    </DemoForm>
  );
}
