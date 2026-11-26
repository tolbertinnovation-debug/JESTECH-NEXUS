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

## 5. Library file uploads: Vercel Blob

Admins and editors upload library files (PDF, EPUB, MP4/WebM video, MP3/M4A/OGG audio) from
**Admin → Library**. Files go straight from the browser to Vercel Blob, so large files skip the
server's 4.5 MB request limit.

1. In Vercel, open the project → **Storage** → **Create Database** → **Blob** → name it
   `jestech-nexus-files` → **Create**.
2. Connect it to the project for **Production** and **Preview**. Vercel adds `BLOB_READ_WRITE_TOKEN`
   for you. Never paste that token anywhere else.
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the site picks it up.

Until a store is connected, the upload box says uploads are off and admins can still paste links.

Settings and limits:

- `UPLOAD_MAX_MB` (optional, default 100) sets the largest file accepted.
- Only signed-in editors and admins can get an upload token, and only for the file types above.
- Uploaded files are public to anyone with the link. The link contains a random part, so it can't be guessed.
  Drafts are hidden in the site, but their files are not secret: don't upload anything private.
- Replacing a file does not delete the old copy. Remove unused files in Vercel → Storage → Blob if space matters.
- There is no virus scanning yet. Upload only files from sources you trust.
- Without Vercel (on your own server), uploads are saved to disk in `UPLOAD_DIR` (default `.data/uploads`)
  and served from `/uploads/…`. Back that folder up.

## 6. Not yet connected (next phase)

- **Password reset by email.** This needs Resend to be configured first.
