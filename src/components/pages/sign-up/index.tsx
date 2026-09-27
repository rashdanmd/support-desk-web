"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { signUpWithEmail } from "@/api/auth";

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
    <main>
      <h1>Create an account</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />

          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      {message && <p>{message}</p>}
      {signUpError && <p role="alert">{signUpError}</p>}
    </main>
  );
}
