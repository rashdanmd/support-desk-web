"use client";

import { useEffect, useState } from "react";
import { getTeams, type Team } from "@/api/teams";
import { handleSubmit } from "./handlers";

export default function CreateTicket() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (error) {
        console.error("Failed to load teams:", error);
      }
    };

    loadTeams();
  }, []);

  return (
    <main>
      <h1>Create a support request</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" />
        </div>

        <div>
          <label htmlFor="team">Team</label>

          <select id="team" name="team">
            <option value="">Select a team</option>

            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" />
        </div>

        <div>
          <label htmlFor="affectedUrl">Affected URL</label>
          <input id="affectedUrl" name="affectedUrl" type="url" />
        </div>

        <div>
          <label htmlFor="curl">cURL</label>
          <textarea id="curl" name="curl" />
        </div>

        <div>
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" defaultValue="medium">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button type="submit">Create ticket</button>
      </form>
    </main>
  );
}
