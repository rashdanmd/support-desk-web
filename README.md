# Support Desk

Web app for raising, tracking, and resolving support requests. Signed-in people see a ticket board, their own tickets, and a form to open a new request. Support staff can review, refer, and resolve tickets, and anyone on a ticket can leave responses.

Authentication is handled by [Supabase](https://supabase.com). Ticket data comes from a separate support API. The browser sends the Supabase access token as a bearer token on each API call.

## Tech

| Area | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| UI | React 19, [styled-components](https://styled-components.com) |
| Language | TypeScript |
| Forms | [react-hook-form](https://react-hook-form.com) |
| Auth | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) — email and password, Google, and an optional demo sign-in |
| Unit and component tests | [Vitest](https://vitest.dev) with Testing Library and jsdom |
| Browser tests | [Playwright](https://playwright.dev) against installed Google Chrome |
| Accessibility checks | [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) |
| Lint | ESLint 9 with `eslint-config-next` |

Path aliases: `@/*` maps to `src/*`, and `@components/*` maps to `src/components/*`.

## Prerequisites

- Node.js 20.9 or later
- npm
- A Supabase project
- The support API this app calls
- Google Chrome, if you will run the Playwright suites

## Install

```bash
npm install
```

Create `.env.local` in the project root. `.env*` files are gitignored.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_API_URL=http://localhost:8080

DEMO_ENABLED=true
DEMO_USER_EMAIL=user@example.com
DEMO_USER_PASSWORD=your-user-password
DEMO_SUPPORT_EMAIL=support@example.com
DEMO_SUPPORT_PASSWORD=your-support-password
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key. The app fails to start if this or the URL is missing |
| `NEXT_PUBLIC_API_URL` | Origin of the support API, with no trailing path. Calls go to `{NEXT_PUBLIC_API_URL}/api/...` |
| `DEMO_ENABLED` | Set to `true` to show **Explore as user** and **Explore as support** on the sign-in screen |
| `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` | Existing Supabase user signed in by the user demo button |
| `DEMO_SUPPORT_EMAIL` / `DEMO_SUPPORT_PASSWORD` | Existing Supabase user signed in by the support demo button |

Demo accounts need to exist in Supabase Auth. Playwright signs in through those buttons, so the demo variables need to be set before browser tests.

Google sign-in uses the OAuth provider in Supabase and returns to `/auth/callback`.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
npm run lint
```

`npm start` serves the production build from `npm run build`.

## Routes

| Path | Who can open it | What it does |
| --- | --- | --- |
| `/` | Everyone | Sign-in and sign-up when there is no session. Ticket board when there is |
| `/my-tickets` | Signed in | Tickets created by the current user |
| `/tickets` | Signed in | Redirects to `/` |
| `/tickets/new` | Signed in | Create a ticket |
| `/tickets/[id]` | Signed in | Ticket details and responses |
| `/tickets/[id]/edit` | Signed in | Edit a ticket |
| `/auth/callback` | OAuth return | Exchanges the Supabase code for a session |
| `/auth/demo` | Demo only | Password sign-in for the demo user and support accounts |

Routes under `src/app/(protected)` read the Supabase session on the server. A missing session redirects to `/`.

Ticket statuses used by the API types are `pending`, `in_review`, `referred`, `resolved`, `closed`, and `cancelled`. Priorities are `low`, `medium`, `high`, and `urgent`.

## Folder structure

```text
src/
  app/                  App Router pages, layouts, and route handlers
    (protected)/        Session-gated pages (board redirect, my tickets, ticket CRUD)
    auth/callback/      Google OAuth callback
    auth/demo/          Demo password sign-in
    sign-in/            Sign-in screen
  api/                  Browser clients for the support API
    auth/               Email sign-in, sign-up, and access token
    tickets/            Ticket reads and writes, plus shared types
    responses/          Ticket responses
    teams/              Teams used when creating a ticket
    users/              Current user (`/api/users/me`)
  components/           UI. Page screens live in components/pages
  lib/                  Supabase clients, demo helpers, greeting and formatting
  services/             Ticket loading used by server components
  test/                 Vitest setup and shared fixtures
playwright/
  functionals/          Browser checks of pages and components
  e2e/                  Longer signed-in journeys
  smoke/                Short checks of the main screens
  support/              Sign-in, API stubs, fixtures, and axe helpers
public/                 Static assets
```

`src/api` talks to the support API. It is separate from `src/app`, which is the Next.js route tree.

## Testing

Vitest covers modules and React components. Playwright covers the app in Chrome. Playwright starts `npm run dev` on port 3000 when nothing is already listening there. Locally it reuses a dev server that is already running. Browser tests sign in with the demo accounts and stub the support API, so they need `.env.local` and Chrome, and they do not need the real API process.

| Command | What it runs |
| --- | --- |
| `npm test` | All Vitest projects |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:unit` | `src/**/*.test.ts` in Node |
| `npm run test:components` | `src/**/*.test.tsx` in jsdom |
| `npm run test:functionals` | Playwright project `functionals` |
| `npm run test:e2e` | Playwright project `e2e` |
| `npm run test:smoke` | Playwright project `smoke` |

Vitest forces `TZ=UTC` so date formatting stays stable. Each `test:*` script has a `:watch` variant for the Vitest projects (`test:unit:watch`, `test:components:watch`).

Playwright runs one worker, uses the installed Google Chrome (`channel: "chrome"`), and retries once when `CI` is set.

## For AI agents

Operational notes for coding agents live in `AGENTS.md`.
