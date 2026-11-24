# Architecture

## Layout

```
src/
  app/
    (site)/            public site, student dashboard, mentor workspace (shared header/footer)
    admin/             staff back-office (own layout)
  components/          design system (ui.tsx), brand, forms, offline helpers
  db/                  schema.ts (single source of truth), seed data, reset
  lib/                 auth (sessions), rbac, password hashing, email, formatting
  modules/
    courses/           cached public queries
    library/           cached public queries
    directory/         experts, partners, innovation (cached public queries)
    learning/          enrolment, progress, points, badges, certificates (engine + actions)
    inquiries/         consultation / partnership / contact / solution forms, issue reports
    mentor/            review queue and review action
    accounts/          register, login, logout
    admin/             back-office queries and actions
drizzle/               SQL migrations (generated)
public/files/          sample library files (replace with object storage)
public/sw.js           service worker
tests/                 unit tests (Vitest) and e2e journeys (Playwright)
```

## Rendering and caching

Cache Components and partial prerendering are on. Each page has two kinds of content:

- **Public content** (catalog, courses, lessons, library, experts, partners, innovation) is read with
  `"use cache"` functions tagged `courses`, `library`, `experts`, `partners` and `innovation`. These pages are
  pre-rendered as static HTML, so they reach phones quickly.
- **Personal content** (login state, progress, dashboard, admin) reads cookies inside `<Suspense>`. It streams in
  after the static page shell.

When an admin action changes public content, it calls `updateTag(<tag>)`. The next visitor then gets fresh content.

> The build reads the database to pre-render public pages, so `DATABASE_URL` must be set at build time.

## Security model

- **Sessions:** a random 32-byte token sits in an HTTP-only, `SameSite=Lax` cookie. The database stores only the
  token's SHA-256 hash. Sessions last 30 days.
- **Passwords:** scrypt with a per-user salt, compared in constant time. Login errors don't reveal whether an
  email exists.
- **Permissions:** `can(role, action)` in `src/lib/rbac.ts` is the single policy. Every server action and
  protected page calls `requireUser(action)` on the server. Hiding a link is never the only protection.
- **Validation:** every server action validates its input with Zod. Redirects after login go only to relative
  paths on this site (`safeNext`).
- **Spam:** public forms have a honeypot field, a consent checkbox, and a limit of 5 messages per contact per hour.
- **Trust rules enforced in code:**
  - Only `PUBLISHED` courses and resources are public.
  - Experts appear only when `APPROVED` with consent and verification recorded.
  - Partners appear only when `APPROVED` with an agreement reference.
  - Case studies need sources.
  - Editors cannot publish; only admins can.
- **Audit log:** every admin and mentor change is written to `audit_log`.

## Learning rules (`src/modules/learning/engine.ts`)

| Event | Points | Badge |
| --- | --- | --- |
| Lesson completed | 10 | "First lesson" (1st), "Quick starter" (3rd) |
| Project submitted | 20 | "Project submitted" |
| Project approved by a mentor | 50 | — |
| Certificate issued | — | "Course complete" |

A certificate is issued automatically, once, when **every lesson is complete and a mentor has approved the
project**. Each certificate has a public verification page at `/certificates/JTN-XXXX-XXXX`.

Students in *private progress mode* are left off the leaderboard.

## Offline

`public/sw.js` uses three caches:

- `nexus-saved`: items the learner saves with **Save offline**. These are never evicted automatically.
- `nexus-static`: hashed build assets, served from the cache first.
- `nexus-pages`: the last copy of each page visited, used only when the network fails.

The worker is registered in production only.
