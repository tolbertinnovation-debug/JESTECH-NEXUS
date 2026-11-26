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

/** True when the page fits a 390px phone screen without sideways scrolling. */
async function fitsPhone(page, path) {
  await page.setViewportSize({ width: 390, height: 844 });
  // Wait for the page's own content, not "network idle": Next.js keeps prefetching linked pages
  // in the background, which on a slow CI machine can take longer than the page itself.
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("main h1").first().waitFor({ timeout: 20000 });
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  await page.setViewportSize({ width: 1280, height: 900 });
  return width <= 390;
}

async function shot(page, name) {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
}

async function login(page, email) {
  await page.goto(`${BASE}/login`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(/\/dashboard/, { waitUntil: "domcontentloaded" });
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
  check(await visible(learner.locator("video source[src$='choosing-a-good-site.mp4']").first().locator("..")), "lesson shows its narrated video");
  check((await learner.locator("video track[kind='captions']").count()) === 1, "lesson video has captions");
  await learner.goto(`${BASE}/courses/cybersecurity-awareness/lessons/mobile-money-safety`);
  check(await visible(learner.getByText(/Never tell anyone your mobile money PIN/)), "new course lesson has real content");
  check((await learner.locator("video source[src$='mobile-money-safety.mp4']").count()) === 1, "new course lesson has its video");
  await learner.goto(`${BASE}/courses/web-development-fundamentals/lessons/html-structure`);
  check((await learner.locator(".prose-lesson pre code").count()) > 0, "web lesson shows code blocks");
  await learner.goto(`${BASE}/courses/grow-cassava/lessons/choosing-a-good-site`);
  const videoRes = await learner.request.get(`${BASE}/videos/grow-cassava/choosing-a-good-site.mp4`);
  check(videoRes.ok() && Number(videoRes.headers()["content-length"]) < 1_000_000, "lesson video file is served and under 1 MB");

  // Ask Grandpa: the AI tutor answers about the current lesson (mock provider in tests).
  await learner.getByRole("button", { name: "Ask Grandpa" }).click();
  const chat = learner.getByRole("dialog", { name: /Ask Grandpa/ });
  await chat.getByRole("button", { name: "Explain this lesson simply" }).click();
  check(await visible(chat.getByText(/This is about Choosing a good site/)), "Ask Grandpa answers about the current lesson");
  check((await chat.locator("strong", { hasText: "Good question!" }).count()) === 1, "Ask Grandpa formats its answer");
  await chat.getByLabel("Your question").fill("And what about rain?");
  await chat.getByRole("button", { name: "Send question" }).click();
  check(await visible(chat.getByText(/You asked: "And what about rain\?"/)), "Ask Grandpa keeps the conversation going");
  await chat.getByRole("button", { name: "Close" }).click();
  for (let i = 0; i < 9; i++) {
    const btn = learner.getByRole("button", { name: "Mark lesson complete" });
    await btn.waitFor();
    const before = learner.url();
    await Promise.all([learner.waitForURL((u) => u.href !== before, { waitUntil: "domcontentloaded" }), btn.click()]);
  }
  await learner.goto(`${BASE}/dashboard`);
  check(await visible(learner.getByText("100%").first()), "dashboard shows 100% course progress");
  check(await visible(learner.getByText(/^[2-4] of 4 earned$/)), "badges awarded");
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
  await Promise.all([
    admin.waitForResponse((r) => r.request().method() === "POST"),
    row.getByRole("button", { name: "Assign" }).click(),
  ]);

  const mentorCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const mentor = await mentorCtx.newPage();
  await login(mentor, "mentor@nexus.local");
  await mentor.goto(`${BASE}/mentor`);
  await shot(mentor, "desktop-mentor");
  await mentor.getByRole("link", { name: /Test Learner/ }).first().click();
  await mentor.getByLabel("Feedback").fill("Clear plan. Good spacing and timing — well done.");
  await mentor.getByRole("button", { name: "Approve" }).click();
  await mentor.waitForURL(/\/mentor\?reviewed=1/, { waitUntil: "domcontentloaded" });
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
  for (const path of ["/dashboard", "/mentor", "/admin", "/admin/users", "/admin/inquiries"]) {
    check(await fitsPhone(admin, path), `${path} fits a phone screen`);
  }
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
  await Promise.all([
    admin.waitForResponse((r) => r.request().method() === "POST"),
    admin.getByRole("button", { name: "Publish" }).click(),
  ]);
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
  await anon.goto(`${BASE}/courses/grow-cassava/lessons/preparing-the-land`);
  await anon.getByRole("button", { name: "Ask Grandpa" }).click();
  await anon.getByRole("button", { name: "Quiz me with 3 questions" }).click();
  check(await visible(anon.getByText(/Please log in to ask Grandpa/)), "Ask Grandpa asks visitors to log in");
  await anon.goto(`${BASE}/partners`);
  await anon.getByText(/Partners will be listed here/).waitFor();
  check((await anon.getByText("Example Pending Partner").count()) === 0, "pending partner is not listed publicly");
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
