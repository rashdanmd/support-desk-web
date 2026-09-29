"use client";

import { useState } from "react";

import DemoSignIn from "@/components/demo-sign-in";
import SignIn from "@/components/pages/auth/sign-in";
import SignUp from "@/components/pages/auth/sign-up";
import { TextButton } from "@/components/ui";

import {
  Brand,
  BrandMark,
  Container,
  Layout,
  Panel,
  Switch,
  Tagline,
  Title,
} from "./styles";

type AuthProps = {
  demoEnabled?: boolean;
  demoUnavailable?: boolean;
};

export default function Auth({
  demoEnabled = false,
  demoUnavailable = false,
}: AuthProps) {
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

        {demoEnabled && <DemoSignIn unavailable={demoUnavailable} />}
      </Container>
    </Layout>
  );
}
