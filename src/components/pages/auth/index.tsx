"use client";

import { useState } from "react";
import styled from "styled-components";

import SignIn from "@/components/pages/sign-in";
import SignUp from "@/components/pages/sign-up";
import { Card, TextButton } from "@/components/ui";

const Layout = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 48px 16px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 400px;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: var(--color-accent-text);
  font-size: 16px;
  font-weight: 700;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: -0.01em;
`;

const Tagline = styled.p`
  margin-top: 2px;
  color: var(--color-text-subtle);
  font-size: 14px;
  line-height: 20px;
`;

const Panel = styled(Card)`
  padding: 24px;
`;

const Switch = styled.p`
  color: var(--color-text-subtle);
  font-size: 13px;
  line-height: 18px;
  text-align: center;
`;

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Layout>
      <Container>
        <Brand>
          <BrandMark aria-hidden="true">S</BrandMark>
          <div>
            <Title>Support Desk</Title>
            <Tagline>Raise, track and resolve support requests.</Tagline>
          </div>
        </Brand>

        <Panel>{isSignUp ? <SignUp /> : <SignIn />}</Panel>

        {isSignUp ? (
          <Switch>
            Already have an account?{" "}
            <TextButton type="button" onClick={() => setIsSignUp(false)}>
              Sign in
            </TextButton>
          </Switch>
        ) : (
          <Switch>
            Don&apos;t have an account?{" "}
            <TextButton type="button" onClick={() => setIsSignUp(true)}>
              Sign up
            </TextButton>
          </Switch>
        )}
      </Container>
    </Layout>
  );
}
