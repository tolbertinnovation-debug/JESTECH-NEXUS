# JesTech Nexus: step-by-step go-live guide

This guide puts the website online. Everything happens in a web browser; you don't need to install anything or
type commands. It takes about 30–45 minutes.

**Before you start**
- Use a **JesTech organisation email** (for example `tech@jestech.org`) for every account, not a personal one.
  This keeps JesTech in control if team members change.
- Never paste passwords, keys or connection strings into a chat, including with Claude. Paste them only into
  the Vercel or Neon websites as the steps below say.

---

## Part 1: Put the code on the main branch (5 minutes)

The new code is on the branch `ccr-3c3b3507-br8oa7` in GitHub. Vercel publishes the **main** branch, so the
code needs to be merged into main first.

1. Ask Claude: **"Open a pull request for the Nexus build."** Claude will reply with a link.
2. Open the link in GitHub.
3. Scroll down and click the green **Merge pull request** button, then **Confirm merge**.

---

## Part 2: Create the database on Neon (10 minutes)

1. Go to **https://neon.com** and click **Sign up**. Sign up with the JesTech email.
2. When asked to create a project, enter:
   - **Project name:** `jestech-nexus`
   - **Postgres version:** leave the default
   - **Region:** **AWS Europe Central 1 (Frankfurt)**. This is the fastest region for users in Liberia.
3. Click **Create project**.
4. On the project dashboard, click **Connect** (top right).
5. In the window that opens:
   - Make sure **Connection pooling** is switched **on**.
   - Copy the connection string. It starts with `postgresql://` and contains `-pooler` and `sslmode=require`.
6. Keep this browser tab open; you'll paste the string into Vercel in Part 3.

> The connection string contains a password. Treat it like one.

---

## Part 3: Publish the website on Vercel (10 minutes)

1. Go to **https://vercel.com/signup**.
   - Choose **Hobby** to start. It's free while you build and test; see Part 7 before the public launch.
   - Click **Continue with GitHub** and sign in with the GitHub account that owns
     `tolbertinnovation-debug/JESTECH-NEXUS`.
2. On the Vercel dashboard, click **Add New… → Project**.
3. Find **JESTECH-NEXUS** in the list and click **Import**.
   - If it isn't listed, click **Adjust GitHub App Permissions** and allow Vercel to access that repository.
4. On the **Configure Project** screen:
   - **Framework Preset:** Next.js (detected automatically). Leave all build settings as they are.
   - Open **Environment Variables** and add:

     | Key | Value |
     | --- | --- |
     | `DATABASE_URL` | the Neon connection string from Part 2 |

5. Click **Deploy** and wait 2–4 minutes. During this first build the website automatically:
   - creates all the database tables
   - loads the courses (including the Cassava pilot) and the library
   - builds the pages
6. When you see **Congratulations**, click the preview image to open your live site. Its address looks like
   `jestech-nexus.vercel.app`.

### Set the server region (recommended)

1. In the Vercel project, open **Settings → Functions**.
2. Set **Function Region** to **Frankfurt, Germany (fra1)** so it matches the database.
3. Click **Save**.

### Tell the site its own address

1. Open **Settings → Environment Variables**.
2. Add `NEXT_PUBLIC_SITE_URL` with your site address, for example `https://jestech-nexus.vercel.app`.
3. Click **Save**.
4. Open **Deployments**, click **⋯** on the latest deployment and choose **Redeploy**.

> **After you change any environment variable**, always redeploy as in step 4, or the change won't take effect.

---

## Part 4: Make yourself the first admin (5 minutes)

1. On the live site, click **Join free** and register with your JesTech email.
2. Go back to **Neon** and open **SQL Editor** in the left menu.
3. Paste this, replacing the email with the one you just registered:

   ```sql
   update users set role = 'ADMIN' where email = 'you@jestech.org';
   ```

4. Click **Run**. It should say `UPDATE 1`.
5. On the website, log out and log in again. You'll now see **Admin** in the top menu.

From now on, give other people roles (Mentor, Content editor, Admin) in **Admin → Users and roles**. You won't
need the SQL Editor again for this.

---

## Part 5: First things to do in Admin

- **Experts:** add real experts and approve them only after confirming identity, qualifications and consent.
  The public Experts page is empty until you do.
- **Partners:** add organisations only once a formal agreement exists. The page shows a "partner with us"
  message until then.
- **Innovation:** create real community challenges, then press **Publish**.
- **Courses:** the 7 courses other than Cassava are outlines only. Ask reviewers to write the lessons in
  **Courses & lessons**, or move a course **Back to draft** to hide it until it's ready.
- **Cassava course:** have the agriculture reviewer check it, then enter their name in the **Reviewer** field.

---

## Part 6: Use your own web address (optional, 10 minutes plus waiting)

1. In Vercel, open **Settings → Domains**, type `nexus.jestech.org` and click **Add**.
2. Vercel shows a DNS record to create, usually a **CNAME** record:
   - name `nexus`
   - value `cname.vercel-dns.com` (copy the exact value Vercel shows)
3. Log in wherever `jestech.org` is managed (your domain registrar or DNS provider) and add that record.
4. Wait until Vercel shows **Valid Configuration**. This can take from minutes to a few hours.
5. Change `NEXT_PUBLIC_SITE_URL` to `https://nexus.jestech.org`, then **Redeploy**.

---

## Part 7: Before the public launch

- **Upgrade Vercel to Pro** (about $20/month) in **Settings → Billing**. The free Hobby plan is for
  non-commercial use only.
- **Upgrade Neon** to a paid plan once real students sign up. This gives you proper backups and stops the
  database "sleeping", which makes the first visit after a quiet period slightly slower.
- **Set up email.** This sends inquiry notifications to your inbox.
  1. Sign up at **https://resend.com**.
  2. Add and verify `jestech.org` under **Domains**. Resend shows DNS records to add, the same way as in Part 6.
  3. Create an API key under **API Keys**.
  4. In Vercel, add these environment variables, then **Redeploy**:

     | Key | Value |
     | --- | --- |
     | `RESEND_API_KEY` | the key from Resend |
     | `EMAIL_FROM` | `JesTech Nexus <nexus@jestech.org>` |
     | `ADMIN_EMAIL` | the inbox that should receive inquiries |

  Until this is set up, inquiries are still saved and appear in **Admin → Inquiries**. They just aren't emailed.

---

## If something goes wrong

| Problem | What to do |
| --- | --- |
| The Vercel build fails | Open the failed deployment and copy the last lines of the **Build Logs**. Share them with Claude; logs don't contain your passwords. |
| The build log mentions `DATABASE_URL` | Check the variable is spelled exactly `DATABASE_URL` and the value is the **pooled** Neon string, then **Redeploy**. |
| The site loads but shows no courses | Redeploy once. The first build loads the content. |
| You can't see **Admin** after Part 4 | Check the email in the SQL matches exactly, then log out and log in again. |

---

## Every time the code changes later

You don't need to do anything. Each time new work is merged into **main** on GitHub, Vercel rebuilds and
updates the site automatically, and any database changes are applied during the build. Pull requests also get
their own **preview link** to check before merging.
