# JesTech Nexus — Build Plan

Source: *JesTech Nexus — Product Vision & Platform Blueprint* (working draft, 14 pages).
This plan turns that blueprint into an engineering roadmap: stack, architecture, data model,
routes, milestones with acceptance criteria, and the decisions still needed.

---

## 1. What we are building (summary of the blueprint)

A mobile-first, low-bandwidth web platform for Liberia that combines:

| Module | Purpose | Key screens (blueprint #) |
|---|---|---|
| **Public site** | Front door, about, contact, report an issue | Home (1) |
| **Courses** | Practical courses (AI, web, cyber, data, design, agriculture, entrepreneurship), each ending in an activity | Catalog (2), Course detail (3), Lesson |
| **Student area** | Progress, points, badges, private-progress mode, submissions, certificates | Dashboard (4), Submit (5), Certificate (6) |
| **Digital library** | Search/filter by subject, audience, format, language; read online or download with visible file size, source, licence | Library (7), Resource detail (8) |
| **Experts** | Approved expert directory + consultation inquiry form | Experts (9) |
| **Partners** | Formally agreed partners only + partnership inquiry form | Partners (10) |
| **Innovation** | Open challenges, case studies, prototypes, submit a solution | Innovation (11) |
| **Admin** | Role-based content, review queue, approvals, inquiries, users | Admin (12) |
| **Mentor workspace** | Assigned students, review submissions, approve / request changes | Mentor (13) |
| **Mobile / offline** | Thumb-friendly UI, “Save offline”, light on data | Mobile (14–16) |

**Non-negotiable principles** (they become acceptance criteria, not just copy):
- Local impact first; learning tied to action (activities + submissions, not just certificates).
- Built for Liberian conditions: mobile-first, lightweight pages, file sizes shown before download.
- Trust & honesty: expert review before publication, sources and dates shown, no unsupported claims.
- **No implied endorsement**: partners/experts only appear after admin approval with recorded agreement/consent.
- Brand: one JesTech family — Orange `#FF6D00`, Black `#000000`, White `#FFFFFF`; Poppins (headings/buttons), Inter (body); simple line icons.

---

## 2. Recommended stack

Chosen to match the blueprint's “reference stack (to confirm)” and the JesTech Academy site on Vercel,
while staying simple enough for a small team to maintain.

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Matches Vercel hosting; server components keep JS sent to phones small |
| Styling | **Tailwind CSS** with JesTech design tokens | Tiny CSS output, easy to keep one brand system |
| UI icons | **lucide-react** (tree-shaken line icons) | Matches the “simple line icons” brand rule |
| Database | **PostgreSQL** (Neon / Vercel Postgres / Supabase, managed backups) | Blueprint requirement |
| ORM / migrations | **Drizzle ORM** + drizzle-kit | Lightweight, typed schema in one file (`src/db/schema.ts`) doubles as the schema handover doc; plain SQL migrations |
| Auth | **Built-in session auth** — scrypt passwords, hashed session tokens in Postgres, HTTP-only cookies | Small, fully understood, no vendor lock-in; roles stored in DB |
| File storage | **S3-compatible object storage** (Cloudflare R2 or Vercel Blob) via signed URLs | Size/type limits, access-controlled downloads |
| Email | **Resend** (or any SMTP) | Inquiry notifications, password reset |
| Search | **Postgres full-text search** (`tsvector` + GIN index) | No extra service for MVP |
| Certificates | Printable certificate page (“Print or save as PDF”) + public verification code `/certificates/[code]` | Auto-issued, verifiable, no extra library |
| Validation | **Zod** on every server action / route handler | Input validation requirement |
| Offline | **PWA service worker** caching the app shell + user-saved files (Cache API) | “Save offline” in MVP; full offline sync is Phase 3 |
| Testing | **Vitest** (unit), **Playwright** (e2e, mobile viewport), Lighthouse CI budgets | |
| CI/CD | GitHub Actions (lint, typecheck, test, build) → Vercel preview per PR | |

> The Academy site (`jestech-academy-two.vercel.app`) could not be inspected from the build environment.
> Step 2 of the blueprint's workflow — confirming exact tokens/fonts/components against it — stays open.
> Tokens live in one file (`tailwind.config.ts` / `globals.css`) so adjusting them later is a one-line change.

---

## 3. Architecture

```
Experience   Next.js App Router · mobile-first UI · JesTech design system · low-bandwidth pages
Modules      courses · library · experts · partners · innovation · inquiries · accounts · admin · mentor
Services     auth & roles · progress & points · certificates · search · email · uploads
Data/files   PostgreSQL (Prisma) · object storage (size/type limits) · content metadata & licences · backups
```

Repository layout (one deployable app, modules as folders so each can grow independently):

```
src/
  app/
    (public)/            home, about, contact, report-issue
    courses/             catalog, [slug], [slug]/lessons/[lesson]
    library/             index, [slug]
    experts/             index, [slug]
    partners/            index
    innovation/          index, challenges/[slug], submit
    (account)/dashboard  dashboard, courses, submissions, badges, certificates, saved
    certificates/[code]  public verification
    mentor/              workspace, submissions/[id]
    admin/               overview, courses, lessons, library, experts, partners,
                         innovation, inquiries, reports, users, settings
    api/                 auth, uploads (signed URLs), downloads, certificates/pdf
  modules/<name>/        queries.ts, actions.ts (server actions), schemas.ts (zod), components/
  components/ui/         Button, Badge, Chip, Card, Input, Tabs, Progress, Table, Dialog…
  lib/                   db, auth, rbac, storage, email, search, format (file sizes), seo
prisma/                  schema.prisma, migrations/, seed.ts
public/                  icons, manifest, offline fallback
tests/                   unit/, e2e/
docs/                    SETUP.md, SCHEMA.md, API.md, DEPLOYMENT.md, ADMIN-GUIDE.md
```

---

## 4. Data model (MVP + hooks for later phases)

```
User(id, name, email, passwordHash?, role[STUDENT|MENTOR|EDITOR|ADMIN], privateProgress, createdAt)

Course(id, slug, title, summary, audience, category, level, format[ONLINE|HYBRID|OFFLINE_GUIDE],
       outcomes[], status[DRAFT|IN_REVIEW|PUBLISHED|ARCHIVED], ownerId, reviewerId, reviewedAt,
       isPilot, coverIcon, publishedAt)
Module(id, courseId, order, title)
Lesson(id, moduleId, order, title, body(markdown), checklist[], estMinutes, mediaIds[])
Activity(id, courseId|lessonId, prompt, submissionTypes[])          -- practical activity

Enrollment(userId, courseId, enrolledAt, completedAt)
LessonProgress(userId, lessonId, completedAt)
Submission(id, userId, activityId, type[LINK|GITHUB|DRIVE|DESIGN|SCREENSHOT|FILE], url?, fileId?,
           description, status[SUBMITTED|CHANGES_REQUESTED|APPROVED], mentorId, feedback, reviewedAt)
MentorAssignment(mentorId, studentId, courseId)
PointsLedger(id, userId, amount, reason, refId, createdAt)
Badge(id, key, name, description)   UserBadge(userId, badgeId, awardedAt)
Certificate(id, code(unique), userId, courseId, issuedAt)

Resource(id, slug, title, description, subject, audience[], format[PDF|EPUB|VIDEO|…], language,
         source/author, publishedDate?, licence[OWNED|PERMISSION|OPEN_LICENCE], licenceNote,
         fileId, sizeBytes, readOnlineUrl?, downloadable, reviewerId, status, updatedAt)
File(id, key, mime, sizeBytes, sha256, uploadedBy, scanStatus)
SavedItem(userId, resourceId|courseId)

Expert(id, slug, name, title, bio, areas[], tags[], photoFileId?, consentAt, verifiedAt,
       verifiedById, status[PENDING|APPROVED|HIDDEN])
Partner(id, name, category[EDUCATION|NGO|BUSINESS|COMMUNITY|DEVELOPMENT], collaborationAreas[],
        logoFileId, website, agreementRef, agreementDate, status[PENDING|APPROVED|HIDDEN])

Challenge(id, slug, title, context, goals, status[OPEN|CLOSED])
InnovationItem(id, type[CASE_STUDY|PROTOTYPE], title, summary, sources[], verifiedAt, status)
SolutionProposal(id, challengeId, userId?, name, contact, summary, status)

Inquiry(id, type[CONSULTATION|PARTNERSHIP|CONTACT], expertId?, subjectArea, message,
        contact, name, status[NEW|IN_PROGRESS|CLOSED], assigneeId, notes, createdAt)
IssueReport(id, targetType, targetId, message, contact?, status, createdAt)
AuditLog(id, actorId, action, entity, entityId, diff, createdAt)
```

Rules enforced in code: only `PUBLISHED` content is public; only `APPROVED` experts/partners with
`verifiedAt`/`agreementRef` are listed; every resource must have a licence before publishing.

---

## 5. Roles & permissions (RBAC)

| Capability | Public | Student | Mentor | Editor | Admin |
|---|:-:|:-:|:-:|:-:|:-:|
| Browse courses, library, experts, partners, innovation | ✓ | ✓ | ✓ | ✓ | ✓ |
| Send inquiries / report issues / propose solutions | ✓ | ✓ | ✓ | ✓ | ✓ |
| Enrol, track progress, save items, submit, earn points/badges/certificates | | ✓ | ✓ | ✓ | ✓ |
| Review assigned students' submissions, give feedback | | | ✓ | | ✓ |
| Create/edit courses, lessons, resources; send for review | | | | ✓ | ✓ |
| Publish, approve experts & partners, manage inquiries, users, roles, settings | | | | | ✓ |

Implemented as a single `can(user, action, resource)` helper used by server actions, route handlers
and middleware (`/admin/*`, `/mentor/*`, `/dashboard/*`). Every admin mutation writes an `AuditLog`.

---

## 6. Low-bandwidth & mobile budget (acceptance criteria)

- Public pages: **≤ 150 KB transferred** on first load (excluding user-requested downloads); JS ≤ 90 KB gz.
- Lighthouse mobile (Slow 4G): Performance ≥ 90, Accessibility ≥ 95.
- Fonts: Poppins + Inter self-hosted via `next/font`, subset, `display: swap`; only weights used.
- Images: AVIF/WebP via `next/image`, lazy-loaded; hero illustration is inline SVG (constellation/sun/hills/tree motif).
- File size + format shown on every download button; “Low-data mode” toggle hides non-essential media.
- Tap targets ≥ 44 px, one-column layouts below `md`, bottom-reachable menu.
- PWA: installable, offline fallback page, “Save offline” stores lessons/resources in Cache API and lists them under *Saved items*.

---

## 7. Security & trust

- HTTPS, secure HTTP-only cookies, CSRF protection (server actions), rate limiting on auth & forms, honeypot/Turnstile on public forms.
- Passwords hashed (argon2/bcrypt); least-privilege roles; admin routes double-checked server-side.
- Uploads: signed direct-to-storage URLs, MIME + extension allow-list, size caps (e.g. 25 MB resources, 10 MB submissions), SHA-256 stored, malware scan hook (ClamAV/provider) before files are served.
- Downloads served via short-lived signed URLs, gated by resource licence/visibility.
- Privacy: consent captured for expert profiles; minimal PII; account deletion; privacy page.
- Disclaimers: “Educational information is not professional advice” on experts/inquiry forms.
- Content provenance on every resource: author/source, date, licence, reviewer.

---

## 8. Milestones

Each milestone ends with a deployed Vercel preview, tests green, and a short demo.

### M0 — Foundation (week 1)
- Next.js + TS + Tailwind + ESLint/Prettier, CI pipeline, Vercel project.
- Design system: tokens, `Button` (primary orange / secondary black-outline), `Chip`, `Badge`, `Card`,
  `Input`, `Select`, `Textarea`, `ProgressBar`, `Table`, `Sidebar`, `NavBar`, `Footer`, `PageHeader`, hero SVG.
- Prisma schema + migrations + seed data (blueprint sample content: 6 courses incl. the Cassava pilot, 4 resources, sample experts/partners/challenges — clearly marked placeholder).
- **Done when:** design-system page renders all components; CI passes; DB seeds locally.

### M1 — Public site + Courses (weeks 2–3)
- Home (hero, trust strip, five module tiles, featured course, innovation highlight, sign-up band), About, Contact, Report an issue.
- Course catalog with category/level/format filters + search; course detail (audience, outcomes, modules, resources, “Reviewed by experts” box, Enrol / Download guide); lesson page with checklist + “Mark lesson complete”.
- **Done when:** visitor can find and read the Cassava course on a 360 px phone within the page budget.

### M2 — Accounts & Student area (weeks 3–4)
- Register/login/reset; enrolment; lesson progress; dashboard (courses in progress, points, badges, next lesson); private-progress mode; saved items.
- Submissions (live link, GitHub, Drive, design, screenshot, file upload); certificate auto-issue on completion + PDF + public verification page.
- **Done when:** a student completes a course, submits a project, and downloads a verifiable certificate.

### M3 — Digital library (week 5)
- Search (full-text) + filters (subject, audience, format, language); resource cards with format, size, licence badges.
- Resource detail metadata table; read online (PDF viewer / EPUB link / video); authorised download; report an issue; low-data mode; “Save offline”.
- **Done when:** every listed resource shows source, date, licence and size; unlicensed resources cannot be published.

### M4 — Experts, Partners, Innovation (week 6)
- Expert directory with area filters, profile pages, consultation inquiry form (+ email notification).
- Partners page (approved only) with category filter + partnership inquiry form.
- Innovation: challenges, case studies, prototypes; “Propose a solution” form.
- **Done when:** nothing appears publicly without admin approval; inquiries land in admin and email.

### M5 — Admin & Mentor (weeks 7–8)
- Admin overview (counts, review queue, recent inquiries); CRUD for courses/modules/lessons/resources with DRAFT → IN_REVIEW → PUBLISHED workflow; uploads; approve experts/partners; inquiry & issue triage; users & roles; settings; audit log.
- Mentor workspace: assigned students, submission review (approve / request changes + feedback), points awarded on approval.
- **Done when:** staff run the platform end-to-end without touching the database.

### M6 — Hardening & handover (week 9)
- Accessibility audit, Lighthouse budgets in CI, Playwright e2e for the five core journeys (Learner, Farmer, Library user, Consultation seeker, Partner), security review, backups verified.
- Docs: `SETUP.md` (env vars), `SCHEMA.md` + API reference, `DEPLOYMENT.md`, `ADMIN-GUIDE.md`.
- **Done when:** pilot-ready; blueprint MVP table fully covered.

### Later phases (from blueprint roadmap)
- **Phase 2 – Engagement:** leaderboards at scale, community discussions, richer challenges/showcase.
- **Phase 3 – Hybrid & scale:** offline-first app with sync, live consultation booking, payments, AI tutor, analytics, in-person labs.

---

## 9. Testing strategy

- Unit: RBAC `can()`, progress/points/certificate rules, file-size formatting, zod schemas.
- Integration: server actions against a test Postgres (Docker) with seeded data.
- E2E (Playwright, Pixel-5 + desktop): the five core journeys from the blueprint.
- Non-functional: Lighthouse CI budgets, axe accessibility checks, bundle-size check on PRs.

---

## 10. Decisions to settle (blueprint p.14) — with proposed defaults

| # | Decision | Proposed default so work can start |
|---|---|---|
| 1 | Which 2–3 course areas launch first, and who reviews? | **Agriculture (Cassava pilot), Web Development Fundamentals, Digital Literacy.** Reviewers named by JesTech. |
| 2 | Library formats first? | **PDF + EPUB**, plus external video links. |
| 3 | Consultation: email, forms, or booking? | **Form → stored inquiry + email to admin**; booking in Phase 3. |
| 4 | Verification before listing experts/partners? | Experts: identity, qualifications, consent, admin approval. Partners: signed agreement ref, approved logo, contact. |
| 5 | Which features need accounts? | Accounts only for enrol/progress, saved items, submissions, certificates. Everything else public. |
| 6 | Simplest maintainable stack/hosting? | Section 2: Next.js on Vercel + managed Postgres + R2/Blob + Resend. |
| 7 | Pilot success measures? | e.g. registrations, lesson completion rate, Cassava guide downloads, submissions reviewed, inquiries answered within 5 days, page weight on 3G. |

Also needed from JesTech: final logo files, confirmation of fonts/tokens from the Academy site,
domain (`nexus.jestech.org`?), hosting/storage/email accounts, and real course/library content.

---

## 11. Build status (updated 2026-11-24)

| Milestone | Status |
|---|---|
| M0 Foundation | ✅ Next.js 16 + Tailwind tokens, design system, Drizzle schema + migrations, seed content, CI workflow |
| M1 Public site + Courses | ✅ Home, About, Contact, Report an issue, Privacy; catalog with filters/search; course detail; lessons with checklists |
| M2 Accounts & student area | ✅ Register/login, enrol, progress, points, badges, private progress mode, submissions, auto-issued verifiable certificates |
| M3 Digital library | ✅ Search + filters, resource detail with source/date/licence/size, read online, download, Save offline (service worker) |
| M4 Experts, partners, innovation | ✅ Approved-only listings, consultation / partnership / solution forms with consent, honeypot and rate limit, email hook |
| M5 Admin & mentor | ✅ Overview, course/module/lesson editor, Draft → Review → Published workflow, library rights, expert/partner verification, innovation, inquiries, issue reports, users & roles, mentor assignment, audit log |
| M6 Hardening & handover | 🟡 E2E journeys (21 checks) passing; docs written. Remaining: R2 file uploads, password reset email, Lighthouse/axe in CI, real content and reviewers |

**Page weight (measured, Pixel 5, first visit):** ~235 KB compressed, of which ~150 KB is the React/Next.js runtime and
~64 KB fonts; later page navigations fetch ~6–10 KB. The 150 KB first-load budget in §6 is not achievable with
Next.js; the realistic target is ≤ 250 KB first load and ≤ 30 KB per subsequent page.
