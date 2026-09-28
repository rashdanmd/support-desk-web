type GreetingUser = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const firstWord = (value: string) => value.split(/\s+/)[0] ?? "";

export const greetingName = (user: GreetingUser) => {
  const metadata = user.user_metadata ?? {};
  const firstName =
    text(metadata.first_name) ||
    text(metadata.given_name) ||
    firstWord(text(metadata.full_name)) ||
    firstWord(text(metadata.name));

  const raw = firstName || text(user.email);
  const name = raw.includes("@") ? (raw.split("@")[0] ?? "") : raw;

  return name || "there";
};
