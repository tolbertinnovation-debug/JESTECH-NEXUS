# Deployment (Vercel + Neon)

> Non-technical, browser-only walkthrough: see [GO-LIVE-GUIDE.md](GO-LIVE-GUIDE.md). On Vercel the `vercel-build`
> script runs migrations and loads course/library content (no demo accounts) before building.

Create every account under a JesTech organisation email, not a personal one.

## 1. Database: Neon

1. Create a Neon project in **Europe (Frankfurt or London)**. This is closest to Liberia's main internet routes.
2. Copy the **pooled** connection string (it ends with `?sslmode=require`).
3. From your computer, run the migrations once, then seed only if you want the sample content:
   ```bash
   DATABASE_URL="postgres://…neon.tech/…?sslmode=require" npm run db:migrate
   ```
   The seed creates dev accounts with a known password. **Do not seed production.** Create the first admin as
   described in step 4.

## 2. Hosting: Vercel

1. Import the GitHub repository into Vercel. The framework is detected automatically.
2. Set the region to the same one as the database (`fra1` or `lhr1`).
3. Add these environment variables under Project → Settings → Environment Variables:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string |
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://nexus.jestech.org` |
| `RESEND_API_KEY` | from Resend (optional at first: emails are logged instead) |
| `EMAIL_FROM` | e.g. `JesTech Nexus <nexus@jestech.org>` (domain verified in Resend) |
| `ADMIN_EMAIL` | inbox that receives inquiry notifications |

4. Deploy. Every pull request gets its own preview link.

## 3. Domain

Add `nexus.jestech.org` in Vercel → Domains, then create the CNAME record it shows at your DNS provider.

## 4. First admin account

Register normally on the live site. Then promote that account to admin once, from your computer:

```bash
psql "$DATABASE_URL" -c "update users set role='ADMIN' where email='you@jestech.org';"
```

After that, manage all other roles from **Admin → Users and roles**.

## 5. Not yet connected (next phase)

- **File uploads.** Library files currently live in `public/files/` or at external `https://` links.
  Cloudflare R2 with signed upload and download links comes next.
- **Password reset by email.** This needs Resend to be configured first.
