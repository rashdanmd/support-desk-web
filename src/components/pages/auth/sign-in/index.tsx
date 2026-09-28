"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { signInWithEmail } from "@/api/auth";
import GoogleSignIn from "@/components/google-sign-in";
import { Alert, CardTitle, FieldError, Form } from "@/components/ui";

import { Divider, FullWidthButton } from "./styles";

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const router = useRouter();
  const [signInError, setSignInError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setSignInError("");

    try {
      await signInWithEmail(data.email, data.password);

      router.refresh();
    } catch (error) {
      setSignInError(
        error instanceof Error ? error.message : "Unable to sign in",
      );
    }
  };

  return (
    <>
      <CardTitle>Sign in</CardTitle>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        {signInError && <Alert role="alert">{signInError}</Alert>}

        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={errors.email ? true : undefined}
            {...register("email", {
              required: "Please enter a valid email address",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />

          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            {...register("password", {
              required: "Please enter a valid password",
            })}
          />

          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </div>

        <FullWidthButton type="submit" $variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </FullWidthButton>
      </Form>

      <Divider>or</Divider>

      <GoogleSignIn />
    </>
  );
}
