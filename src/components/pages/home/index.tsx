import { createClient } from "@/lib/supabase/server";
import SignOut from "@/components/sign-out";
import Auth from "@/components/pages/auth";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      {user ? (
        <>
          <h1>Support Desk</h1>

          <p>Welcome, {user.user_metadata.full_name ?? user.email}</p>

          <p>You are logged in.</p>

          <SignOut />
        </>
      ) : (
        <Auth />
      )}
    </main>
  );
}
