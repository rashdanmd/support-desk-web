import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const unavailable = (origin: string) =>
  NextResponse.redirect(new URL("/?demo=unavailable", origin), 303);

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const email = process.env.DEMO_USER_EMAIL;
  const password = process.env.DEMO_USER_PASSWORD;

  if (!email || !password) {
    return unavailable(origin);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Demo sign-in failed:", error.message);
    return unavailable(origin);
  }

  return NextResponse.redirect(new URL("/", origin), 303);
}
