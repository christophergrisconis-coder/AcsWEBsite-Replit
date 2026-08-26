# Advanced Creation Studio

Public-facing portfolio and partner hub for Advanced Creation Studio (ACS) — strategic creative direction, workforce programs, outcomes reporting, and agency partner resources.

## Stack

- **Frontend:** Vite + React (`artifacts/studio`)
- **Design system:** Organic (`artifacts/organic`)
- **API:** Express 5 (`artifacts/api-server`)
- **Database:** PostgreSQL + Drizzle ORM
- **Monorepo:** pnpm workspaces

## Prerequisites

- Node.js 22+ (Replit targets Node 24)
- pnpm
- PostgreSQL

## Setup

```bash
# Install dependencies
pnpm install

# Create a local database and postgres user (example)
sudo -u postgres createuser -s ubuntu
sudo -u postgres createdb acs_studio -O ubuntu
sudo -u postgres psql -c "ALTER USER ubuntu WITH PASSWORD 'your_password';"

# Copy env and adjust if needed
cp .env.example .env
# Set DATABASE_URL=postgresql://ubuntu:your_password@localhost:5432/acs_studio
```

## Run locally

In separate terminals:

```bash
# API (port 8080)
export DATABASE_URL=postgresql://localhost:5432/acs_studio
export PORT=8080
pnpm --filter @workspace/api-server run dev
```

```bash
# Studio site (port 18425)
export PORT=18425
export BASE_PATH=/
pnpm --filter @workspace/studio run dev
```

Open http://127.0.0.1:18425

The studio dev server proxies `/api/*` to the API on port 8080.

## Briefing requests

Agency briefing submissions are stored in Postgres (`briefing_requests`) and the
API attempts to email ACS staff.

Set these in `.env` / your host environment:

| Variable | Purpose |
|----------|---------|
| `BRIEFING_NOTIFY_EMAIL` | Inbox that receives new briefing alerts |
| `BRIEFING_NOTIFY_FROM` | Optional From address |
| `SMTP_URL` **or** `SMTP_HOST` (+ `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) | Outbound mail |

If SMTP or `BRIEFING_NOTIFY_EMAIL` is missing, the request is still saved and the
notification is written to API logs (`notification_status = logged`).

Admin inbox: `/admin/briefings` (unlock with `SESSION_SECRET` as the admin token).

## Partner capabilities PDF

`GET /api/partner-resources/capabilities.pdf` returns a downloadable PDF for
procurement packets. The Partners page links to this endpoint directly.

## PWA

Production builds register `sw.js` for offline shell caching and show an install
prompt when the browser fires `beforeinstallprompt`. Icons and
`manifest.webmanifest` live under `artifacts/studio/public/`.

## Admin

Set `SESSION_SECRET` and use it as the admin token on:

- `/admin/briefings`
- `/admin/outcomes`
- `/admin/partner-proofs`

## Other commands

- `pnpm run typecheck` — typecheck all packages
- `pnpm run build` — build all packages
- `pnpm --filter @workspace/studio run test:e2e` — Playwright tests

## Project structure

| Path | Purpose |
|------|---------|
| `artifacts/studio` | Main marketing site |
| `artifacts/api-server` | REST API for outcomes, briefings, partner proofs |
| `artifacts/organic` | Shared design system and UI primitives |
| `lib/db` | Drizzle schema and database client |
| `lib/api-spec` | OpenAPI spec and codegen |
| `attached_assets` | Images and static assets |
