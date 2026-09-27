import { getAccessToken } from "@/api/auth";

export type CurrentUser = {
  id: string;
  email: string | null;
  role: "user" | "support" | "admin";
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get current user");
  }

  return response.json();
};
