import type { Page, Route } from "@playwright/test";

import type { CreateTicketData, Ticket } from "../../src/api/tickets/types";
import type { CurrentUser } from "../../src/api/users";

import { SIGNED_IN_USER, ticket } from "./tickets";

type Team = {
  id: number;
  name: string;
  description: string | null;
};

type StubOptions = {
  tickets?: Ticket[];
  role?: CurrentUser["role"];
  teams?: Team[];
};

const defaultTeams: Team[] = [
  { id: 2, name: "Platform", description: null },
  { id: 3, name: "Identity", description: null },
];

const userIdFromAuthorization = (authorization: string | undefined) => {
  const token = authorization?.replace(/^Bearer\s+/i, "");
  const payload = token?.split(".")[1];

  if (!payload) {
    return null;
  }

  try {
    const claims = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { sub?: string };

    return claims.sub ?? null;
  } catch {
    return null;
  }
};

const forViewer = (item: Ticket, viewerId: string | null): Ticket => {
  if (item.created_by !== SIGNED_IN_USER || !viewerId) {
    return item;
  }

  return {
    ...item,
    created_by: viewerId,
    creator: { ...item.creator, id: viewerId },
  };
};

const fulfill = (
  route: Route,
  { status = 200, json }: { status?: number; json: unknown },
) =>
  route.fulfill({
    status,
    contentType: "application/json",
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    },
    json,
  });

export const stubSupportApi = async (
  page: Page,
  options: StubOptions = {},
) => {
  const tickets = [...(options.tickets ?? [])];
  const teams = options.teams ?? defaultTeams;
  const created: CreateTicketData[] = [];

  await page.route(/\/api\/(tickets|users|teams)(\/|$|\?)/, async (route) => {
    const request = route.request();
    const method = request.method();
    const { pathname } = new URL(request.url());
    const viewerId = userIdFromAuthorization(
      request.headers().authorization,
    );

    if (method === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
          "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
        },
      });
      return;
    }

    if (pathname === "/api/users/me" && method === "GET") {
      await fulfill(route, {
        json: {
          id: viewerId ?? "user",
          email: "demo@example.com",
          role: options.role ?? "user",
        } satisfies CurrentUser,
      });
      return;
    }

    if (pathname === "/api/teams" && method === "GET") {
      await fulfill(route, { json: teams });
      return;
    }

    if (pathname === "/api/tickets" && method === "GET") {
      await fulfill(route, {
        json: tickets.map((item) => forViewer(item, viewerId)),
      });
      return;
    }

    if (pathname === "/api/tickets" && method === "POST") {
      const body = request.postDataJSON() as CreateTicketData;
      const team = teams.find((item) => item.id === body.teamId);
      const createdTicket = ticket({
        id: 100 + created.length,
        title: body.title,
        description: body.description,
        team_id: body.teamId,
        priority: body.priority,
        affected_url: body.affectedUrl || null,
        curl: body.curl || null,
        team: team ?? { id: body.teamId, name: "Team" },
      });

      tickets.push(createdTicket);
      created.push(body);
      await fulfill(route, { json: forViewer(createdTicket, viewerId) });
      return;
    }

    const cancelMatch = pathname.match(/^\/api\/tickets\/(\d+)\/cancel$/);

    if (cancelMatch && method === "POST") {
      const id = Number(cancelMatch[1]);
      const index = tickets.findIndex((item) => item.id === id);

      if (index === -1) {
        await fulfill(route, { status: 404, json: {} });
        return;
      }

      tickets[index] = {
        ...tickets[index],
        status: "cancelled",
        cancelled_at: tickets[index].created_at,
      };
      await fulfill(route, { json: forViewer(tickets[index], viewerId) });
      return;
    }

    const responsesMatch = pathname.match(
      /^\/api\/tickets\/(\d+)\/responses$/,
    );

    if (responsesMatch && method === "GET") {
      await fulfill(route, { json: [] });
      return;
    }

    const ticketMatch = pathname.match(/^\/api\/tickets\/(\d+)$/);

    if (ticketMatch && method === "GET") {
      const found = tickets.find((item) => item.id === Number(ticketMatch[1]));

      if (!found) {
        await fulfill(route, { status: 404, json: {} });
        return;
      }

      await fulfill(route, { json: forViewer(found, viewerId) });
      return;
    }

    await fulfill(route, {
      status: 404,
      json: { error: `No functional stub for ${method} ${pathname}` },
    });
  });

  return { created };
};
