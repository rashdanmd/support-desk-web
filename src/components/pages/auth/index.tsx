"use client";

import { useState } from "react";
import styled from "styled-components";

import SignIn from "@/components/pages/sign-in";
import SignUp from "@/components/pages/sign-up";

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  @media (min-width: 768px) {
    max-width: 480px;
    padding: 32px;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
  }

  p,
  label {
    font-size: 14px;
    line-height: 20px;
  }
`;

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Layout>
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
            Don&apos;t have an account?{" "}
            <button type="button" onClick={() => setIsSignUp(true)}>
              Sign up
            </button>
          </p>
        </>
      )}
    </Layout>
  );
}
