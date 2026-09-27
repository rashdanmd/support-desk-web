"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { signInWithEmail } from "@/api/auth";
import GoogleSignIn from "@/components/google-sign-in";

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
      <h2>Sign in</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
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
            })}
          />

          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {signInError && <p role="alert">{signInError}</p>}

      <p>or</p>

      <GoogleSignIn />
    </>
  );
}
