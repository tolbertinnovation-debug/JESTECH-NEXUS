/**
 * End-to-end journey check against a running server (default http://localhost:3000).
 * Usage: node tests/e2e/journeys.mjs [baseUrl] [screenshotDir]
 * Requires a freshly seeded database (npm run db:reset).
 */
import { createRequire } from "node:module";

// Resolve Playwright from the project or a global install (set NODE_PATH to the global root).
const { chromium, devices } = createRequire(import.meta.url)("playwright");

const BASE = process.argv[2] ?? "http://localhost:3000";
const SHOTS = process.argv[3];
const PASSWORD = "nexus-dev-2026";
let failures = 0;

function check(cond, msg) {
  console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`);
  if (!cond) failures++;
}

/** Waits (up to 15s) for streamed content instead of checking instantly. */
async function visible(locator) {
  try {
    await locator.waitFor({ state: "visible", timeout: 15000 });
    return true;
  } catch {
    return false;
  }
}

async function shot(page, name) {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
}

async function login(page, email) {
  await page.goto(`${BASE}/login`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(/\/dashboard/);
}

const browser = await chromium.launch();

/* ---------- Page weight on a phone (compressed bytes over the wire) ---------- */
{
  const ctx = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await ctx.newPage();
  for (const path of ["/", "/courses", "/library", "/courses/grow-cassava/lessons/preparing-the-land"]) {
    let bytes = 0;
    const onResp = async (r) => {
      const h = await r.allHeaders().catch(() => ({}));
      bytes += Number(h["content-length"] ?? (await r.body().catch(() => Buffer.alloc(0))).length);
    };
    page.on("response", onResp);
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    page.off("response", onResp);
    console.log(`INFO  ${path} transferred ~${Math.round(bytes / 1024)} KB (uncompressed fallback where no length header)`);
  }
  await page.goto(`${BASE}/`);
  await shot(page, "mobile-home");
  await page.getByRole("button", { name: "Open menu" }).click();
  check(await visible(page.getByRole("navigation", { name: "Mobile" })), "mobile menu opens");
  await page.goto(`${BASE}/courses/grow-cassava/lessons/preparing-the-land`);
  await shot(page, "mobile-lesson");
  await page.goto(`${BASE}/library`);
  await shot(page, "mobile-library");
  await ctx.close();
}

/* ---------- Learner journey ---------- */
const email = `learner${Date.now()}@example.com`;
const learnerCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const learner = await learnerCtx.newPage();
{
  await learner.goto(`${BASE}/`);
  check(await visible(learner.getByRole("heading", { name: /Skills and knowledge that/ })), "home hero renders");
  await shot(learner, "desktop-home");

  await learner.goto(`${BASE}/courses?category=Agriculture`);
  await learner.getByText(/^1 course$/).waitFor();
  check((await learner.getByRole("link", { name: /How to Grow Cassava/ }).count()) === 1, "catalog filters to agriculture");
  check(await visible(learner.getByText(/9 modules/)), "catalog shows module count");
  await shot(learner, "desktop-catalog");

  await learner.goto(`${BASE}/courses/grow-cassava`);
  await shot(learner, "desktop-course");
  await learner.getByRole("button", { name: "Enrol free" }).click();
  await learner.waitForURL(/\/register/);
  await learner.getByLabel("Full name").fill("Test Learner");
  await learner.getByLabel("Email").fill(email);
  await learner.getByLabel("Password").fill("a-strong-password");
  await learner.getByRole("button", { name: "Create free account" }).click();
  await learner.waitForURL(/\/courses\/grow-cassava/);
  await learner.getByRole("button", { name: "Enrol free" }).click();
  await learner.getByText("Your progress").waitFor();
  check(true, "registered and enrolled");

  // Complete all 9 lessons via the "Mark lesson complete" flow (redirects to next lesson).
  await learner.goto(`${BASE}/courses/grow-cassava/lessons/choosing-a-good-site`);
  for (let i = 0; i < 9; i++) {
    const btn = learner.getByRole("button", { name: "Mark lesson complete" });
    await btn.waitFor();
    await Promise.all([learner.waitForLoadState("networkidle"), btn.click()]);
    await learner.waitForTimeout(300);
  }
  await learner.goto(`${BASE}/dashboard`);
  check(await visible(learner.getByText("100%").first()), "dashboard shows 100% course progress");
  check(await visible(learner.getByText("Quick starter")), "badges awarded");
  await shot(learner, "desktop-dashboard");

  await learner.goto(`${BASE}/dashboard/submissions`);
  await learner.getByRole("button", { name: "GitHub repo" }).click();
  await learner.getByLabel("Link").fill("not a url");
  await learner.getByLabel("Short description").fill("short");
  await learner.getByRole("button", { name: "Submit for review" }).click();
  check(await visible(learner.getByText(/full link starting with https/)), "submission validation errors shown");
  await learner.getByLabel("Link").fill("https://example.com/cassava-plan");
  await learner.getByLabel("Short description").fill("My plot plan with mounds, 1m spacing, planting in April.");
  await learner.getByRole("button", { name: "Submit for review" }).click();
  check(await visible(learner.getByText("Submitted for review")), "project submitted");
}

/* ---------- Mentor review → certificate ---------- */
{
  // Assign the new learner to the demo mentor (admin), then mentor approves.
  const adminCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const admin = await adminCtx.newPage();
  await login(admin, "admin@nexus.local");
  await admin.goto(`${BASE}/admin/users`);
  const row = admin.getByRole("row", { name: new RegExp(email) });
  await row.getByLabel(/Mentor for/).selectOption({ label: "Mentor Demo" });
  await row.getByRole("button", { name: "Assign" }).click();
  await admin.waitForLoadState("networkidle");

  const mentorCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const mentor = await mentorCtx.newPage();
  await login(mentor, "mentor@nexus.local");
  await mentor.goto(`${BASE}/mentor`);
  await shot(mentor, "desktop-mentor");
  await mentor.getByRole("link", { name: /Test Learner/ }).first().click();
  await mentor.getByLabel("Feedback").fill("Clear plan. Good spacing and timing — well done.");
  await mentor.getByRole("button", { name: "Approve" }).click();
  await mentor.waitForURL(/\/mentor\?reviewed=1/);
  check(true, "mentor approved submission");

  await learner.goto(`${BASE}/dashboard/certificates`);
  const certLink = learner.getByRole("link", { name: "How to Grow Cassava" });
  check(await visible(certLink), "certificate issued automatically");
  await certLink.click();
  await learner.getByText("Certificate of completion").waitFor();
  check(await visible(learner.getByRole("heading", { name: "Test Learner" })), "public certificate verification page");
  await shot(learner, "desktop-certificate");

  /* ---------- Admin: inquiry arrives, course publishing ---------- */
  const visitor = await browser.newPage();
  await visitor.goto(`${BASE}/experts`);
  await shot(visitor, "desktop-experts");
  await visitor.getByLabel("Subject area").selectOption("Agriculture");
  await visitor.getByLabel("Describe your problem").fill("Our cassava leaves are yellow and twisted. What should we do?");
  await visitor.getByLabel("Your name").fill("Farmer Group");
  await visitor.getByLabel("Preferred contact").fill("+231 000 0000");
  await visitor.getByRole("button", { name: "Send inquiry" }).click();
  check(await visible(visitor.getByText(/Please agree/)), "consultation form requires consent");
  await visitor.getByLabel(/I agree/).check();
  await visitor.getByRole("button", { name: "Send inquiry" }).click();
  await visitor.getByText(/inquiry has been received/).waitFor();
  check(true, "consultation inquiry sent");

  await admin.goto(`${BASE}/admin`);
  check(await visible(admin.getByText("Consultation request").first()), "inquiry appears on admin overview");
  await shot(admin, "desktop-admin");

  await admin.goto(`${BASE}/admin/courses`);
  await admin.getByLabel("Title").fill("Solar Basics for Communities");
  await admin.getByLabel("Web address (slug)").fill("solar-basics");
  await admin.getByLabel("Summary").fill("Understand small solar systems for homes and community centres.");
  await admin.getByLabel("Audience").fill("For community groups and young technicians.");
  await admin.getByRole("button", { name: "Create course" }).click();
  await admin.waitForURL(/\/admin\/courses\/[0-9a-f-]{36}$/, { timeout: 15000 }).catch(async (e) => {
    await shot(admin, "debug-admin-create");
    console.log("DEBUG url", admin.url(), await admin.getByRole("alert").allInnerTexts());
    throw e;
  });
  check(true, "admin created a draft course");
  const anon = await browser.newPage();
  // Streaming pages send the status before the lookup finishes, so check content (and noindex) instead.
  await anon.goto(`${BASE}/courses/solar-basics`);
  check(
    (await visible(anon.getByText(/couldn.t find that page/))) && (await anon.getByText("Solar Basics for Communities").count()) === 0,
    "draft course is not public",
  );
  await admin.getByRole("button", { name: "Publish" }).click();
  await admin.waitForLoadState("networkidle");
  await anon.waitForTimeout(500);
  await anon.goto(`${BASE}/courses/solar-basics`);
  check(await visible(anon.getByRole("heading", { name: "Solar Basics for Communities" })), "published course is live");

  /* ---------- Access control ---------- */
  const anonDash = await browser.newPage();
  await anonDash.goto(`${BASE}/admin`);
  await anonDash.waitForURL(/\/login/);
  check(true, "anonymous users are sent to login from /admin");
  await learner.goto(`${BASE}/admin`);
  await learner.waitForURL(/\/dashboard\?denied=1/);
  check(true, "students cannot open admin");
  await anon.goto(`${BASE}/partners`);
  await anon.getByText(/Partners will be listed here/).waitFor();
  check((await anon.getByText("Example Pending Partner").count()) === 0, "pending partner is not listed publicly");
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
