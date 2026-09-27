"use client";

import { useState } from "react";

import SignIn from "@/components/pages/sign-in";
import SignUp from "@/components/pages/sign-up";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div>
      <h1>Support Desk</h1>

      <p>Raise, track and resolve support requests.</p>

      {isSignUp ? (
        <>
          <SignUp />

          <p>
            Already have an account?{" "}
            <button type="button" onClick={() => setIsSignUp(false)}>
              Sign in
            </button>
          </p>
        </>
      ) : (
        <>
          <SignIn />

          <p>
            Don't have an account?{" "}
            <button type="button" onClick={() => setIsSignUp(true)}>
              Sign up
            </button>
          </p>
        </>
      )}
    </div>
  );
}
