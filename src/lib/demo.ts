export type DemoRole = "user" | "support";

export function isDemoEnabled() {
  return process.env.DEMO_ENABLED === "true";
}

export function isDemoRole(value: FormDataEntryValue | null): value is DemoRole {
  return value === "user" || value === "support";
}

export function getDemoCredentials(role: DemoRole) {
  const email =
    role === "user"
      ? process.env.DEMO_USER_EMAIL
      : process.env.DEMO_SUPPORT_EMAIL;
  const password =
    role === "user"
      ? process.env.DEMO_USER_PASSWORD
      : process.env.DEMO_SUPPORT_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email, password };
}
