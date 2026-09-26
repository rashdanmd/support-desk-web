import GoogleSignIn from "@/components/google-sign-in";
import SignOut from "@/components/sign-out";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <h1>Support Desk</h1>

      {user ? (
        <>
          <p>Welcome, {user.user_metadata.full_name ?? user.email}</p>

          <p>You are logged in.</p>

          <SignOut />
        </>
      ) : (
        <>
          <p>Sign in to raise and manage support requests.</p>

          <GoogleSignIn />
        </>
      )}
    </main>
  );
}
