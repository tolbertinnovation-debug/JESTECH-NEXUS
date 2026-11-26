# JesTech Nexus

A digital innovation and talent ecosystem for Liberia. It brings together practical courses, a digital library,
local experts, partners and community innovation challenges. It is built mobile-first for low-bandwidth connections.

See [PLAN.md](PLAN.md) for the build plan and [docs/](docs/) for setup, architecture and admin guides.

## Quick start (local development)

Requirements: Node.js 22+, PostgreSQL 15+.

```bash
npm install
cp .env.example .env          # then edit DATABASE_URL
npm run db:migrate            # create tables
npm run db:seed               # sample content + dev accounts
npm run dev                   # http://localhost:3000
```

Dev accounts (password `nexus-dev-2026`, development only):

| Email                 | Role           |
| --------------------- | -------------- |
| `admin@nexus.local`   | Admin          |
| `editor@nexus.local`  | Content editor |
| `mentor@nexus.local`  | Mentor         |
| `student@nexus.local` | Student        |

## Scripts

| Command                | What it does                                                  |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Development server                                            |
| `npm run build`        | Production build (needs `DATABASE_URL`: public pages are pre-rendered from the database) |
| `npm run lint`         | ESLint                                                        |
| `npm run typecheck`    | TypeScript                                                    |
| `npm test`             | Unit tests (Vitest)                                           |
| `npm run test:e2e`     | End-to-end journeys against a running server (Playwright)     |
| `npm run db:generate`  | Create a migration after changing `src/db/schema.ts`          |
| `npm run db:migrate`   | Apply migrations                                              |
| `npm run db:seed`      | Load sample content (skips if already seeded)                 |
| `npm run db:reset`     | Drop everything, migrate and reseed (refuses to run in production) |

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · PostgreSQL with Drizzle ORM ·
Zod validation · lucide icons · a service worker for offline lessons and files.
Planned hosting: Vercel + Neon (Postgres) + Vercel Blob (library uploads) + Resend (email). See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
