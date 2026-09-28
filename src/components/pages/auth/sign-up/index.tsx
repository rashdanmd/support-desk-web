"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { signUpWithEmail } from "@/api/auth";
import { Alert, CardTitle, FieldError, Form, Notice } from "@/components/ui";

import { FullWidthButton, NameRow } from "./styles";

type SignUpFormData = {
  firstName: string;
  surname: string;
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
      await signUpWithEmail(
        data.firstName,
        data.surname,
        data.email,
        data.password,
      );

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

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        {message && <Notice>{message}</Notice>}
        {signUpError && <Alert role="alert">{signUpError}</Alert>}

        <NameRow>
          <div>
            <label htmlFor="first-name">First name</label>
            <input
              id="first-name"
              type="text"
              autoComplete="given-name"
              aria-invalid={errors.firstName ? true : undefined}
              {...register("firstName", {
                validate: (value) =>
                  value.trim().length > 0 || "Please enter your first name",
              })}
            />
            {errors.firstName && (
              <FieldError>{errors.firstName.message}</FieldError>
            )}
          </div>

          <div>
            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              type="text"
              autoComplete="family-name"
              aria-invalid={errors.surname ? true : undefined}
              {...register("surname", {
                validate: (value) =>
                  value.trim().length > 0 || "Please enter your surname",
              })}
            />
            {errors.surname && (
              <FieldError>{errors.surname.message}</FieldError>
            )}
          </div>
        </NameRow>

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
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            {...register("password", {
              required: "Please enter a valid password",
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
            aria-invalid={errors.confirmPassword ? true : undefined}
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
