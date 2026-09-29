import { NextResponse } from "next/server";

import { getDemoCredentials, isDemoEnabled, isDemoRole } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";

const unavailable = (origin: string) =>
  NextResponse.redirect(new URL("/?demo=unavailable", origin), 303);

export async function POST(request: Request) {
  const { origin } = new URL(request.url);

  if (!isDemoEnabled()) {
    return NextResponse.redirect(new URL("/", origin), 303);
  }

  const role = (await request.formData()).get("role");

  if (!isDemoRole(role)) {
    return unavailable(origin);
  }

  const credentials = getDemoCredentials(role);

  if (!credentials) {
    return unavailable(origin);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    console.error("Demo sign-in failed:", error.message);
    return unavailable(origin);
  }

  return NextResponse.redirect(new URL("/", origin), 303);
}
