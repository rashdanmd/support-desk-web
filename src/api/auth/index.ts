import { createClient } from "@/lib/supabase/client";

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUpWithEmail = async (
  firstName: string,
  surname: string,
  email: string,
  password: string,
) => {
  const supabase = createClient();
  const trimmedFirstName = firstName.trim();
  const trimmedSurname = surname.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: trimmedFirstName,
        last_name: trimmedSurname,
        full_name: `${trimmedFirstName} ${trimmedSurname}`,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const getAccessToken = async (): Promise<string> => {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error("User is not authenticated");
  }

  return session.access_token;
};
