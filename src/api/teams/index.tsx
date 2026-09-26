export type Team = {
  id: number;
  name: string;
  description: string | null;
};

export const getTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`);

  if (!response.ok) {
    throw new Error("Failed to get teams");
  }

  return response.json();
};
