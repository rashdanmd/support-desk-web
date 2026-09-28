"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import styled from "styled-components";

import { signUpWithEmail } from "@/api/auth";
import {
  Alert,
  Button,
  CardTitle,
  FieldError,
  Form,
  Notice,
} from "@/components/ui";

const FullWidthButton = styled(Button)`
  width: 100%;
`;

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const [message, setMessage] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    setMessage("");
    setSignUpError("");

    try {
      await signUpWithEmail(data.name, data.email, data.password);

      setMessage(
        "Account created. Please check your email to confirm your account before signing in.",
      );
    } catch (error) {
      setSignUpError(
        error instanceof Error ? error.message : "Unable to create account",
      );
    }
  };

  return (
    <>
      <CardTitle>Create an account</CardTitle>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {message && <Notice>{message}</Notice>}
        {signUpError && <Alert role="alert">{signUpError}</Alert>}

        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />

          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </div>

        <FullWidthButton type="submit" $variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </FullWidthButton>
      </Form>
    </>
  );
}
