/**
 * Builds the narrated lesson videos in public/videos/<course>/:
 *   <lesson>.mp4 (960x540 H.264, mono AAC), <lesson>.jpg (poster), <lesson>.vtt (captions)
 * and prints a JSON manifest (duration and size per lesson).
 *
 * Requirements (development only, not needed to run the site):
 *   - Playwright with Chromium (NODE_PATH pointing at a global install is fine)
 *   - ffmpeg / ffprobe
 *   - Piper TTS: PIPER=/path/to/piper and PIPER_MODEL=/path/to/en-us-libritts-high.onnx
 *     (LibriTTS voice, CC BY 4.0; speaker set by PIPER_SPEAKER, default 0)
 *
 * Usage: node scripts/videos/build.mjs [lesson-slug ...]
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { art, heroArt } from "./art.mjs";
import { course, lessons } from "./cassava.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(ROOT, "public/videos", course.slug);
const WORK = path.join(process.env.VIDEO_WORKDIR ?? tmpdir(), "nexus-video-build");
const PIPER = process.env.PIPER ?? "piper";
const MODEL = process.env.PIPER_MODEL;
const SPEAKER = process.env.PIPER_SPEAKER ?? "0";
if (!MODEL) throw new Error("Set PIPER_MODEL to the LibriTTS .onnx voice file.");

const W = 1280;
const H = 720;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ------------------------------------------------------------ templates */

const shell = (body) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=block" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:${W}px;height:${H}px;overflow:hidden;font-family:Inter,sans-serif;background:#fff;color:#000}
  h1,h2,.d{font-family:Poppins,Inter,sans-serif}
  .bar{position:absolute;inset:0 0 auto 0;height:64px;background:#000;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 40px}
  .logo{display:flex;align-items:center;gap:12px;font-weight:700;font-size:22px}
  .jt{background:#FF6D00;color:#000;border-radius:8px;width:44px;height:34px;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700}
  .crumb{font-size:18px;color:rgba(255,255,255,.75)}
  .foot{position:absolute;left:40px;right:40px;bottom:22px;font-size:15px;color:#6b6b6b;display:flex;justify-content:space-between}
  .eyebrow{color:#FF6D00;font-weight:700;letter-spacing:.16em;text-transform:uppercase;font-size:18px}
</style></head><body>${body}</body></html>`;

const topBar = (l) =>
  `<div class="bar"><div class="logo d"><span class="jt">JT</span>JesTech Nexus</div><div class="crumb">${esc(course.title)} · Module ${l.module} of ${lessons.length}</div></div>`;

const draft = `<div class="foot"><span>Draft lesson · to be reviewed by agricultural specialists</span></div>`;

function titleFrame(l) {
  return shell(`
  <div style="position:absolute;inset:0;background:#000;color:#fff;display:grid;grid-template-columns:1fr 1fr">
    <div style="padding:80px 60px;display:flex;flex-direction:column;justify-content:center;gap:22px">
      <div class="logo d"><span class="jt">JT</span>JesTech Nexus</div>
      <div class="eyebrow" style="margin-top:30px">${esc(course.title)} · Module ${l.module} of ${lessons.length}</div>
      <h1 style="font-size:64px;line-height:1.08">${esc(l.title)}</h1>
    </div>
    <div>${heroArt()}</div>
  </div>`);
}

function stepFrame(l, scene, k) {
  const items = scene.points
    .map(([text], i) => {
      if (i > k) return "";
      const current = i === k;
      return `<li style="display:flex;gap:18px;align-items:flex-start;padding:14px 18px;border-radius:14px;${current ? "background:#FFF1E6;border-left:6px solid #FF6D00" : "border-left:6px solid transparent;opacity:.7"}">
        <span style="flex:none;width:34px;height:34px;border-radius:50%;background:${current ? "#FF6D00" : "#1A1A1A"};color:${current ? "#000" : "#fff"};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px">${i + 1}</span>
        <span style="font-size:${current ? 34 : 28}px;font-weight:${current ? 700 : 500};line-height:1.25">${esc(text)}</span></li>`;
    })
    .join("");
  return shell(`${topBar(l)}
  <div style="position:absolute;top:100px;left:40px;width:520px;height:520px;border-radius:28px;overflow:hidden">${art[scene.art]().replace('width="600" height="600"', 'width="520" height="520"')}</div>
  <div style="position:absolute;top:110px;left:610px;right:40px">
    <div class="eyebrow">${esc(l.title)}</div>
    <h2 style="font-size:44px;margin:10px 0 22px">${esc(scene.heading)}</h2>
    <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">${items}</ul>
  </div>${draft}`);
}

function recapFrame(l) {
  const items = l.checklist
    .map(
      (c) => `<li style="display:flex;gap:20px;align-items:center;font-size:36px;font-weight:600">
      <span style="flex:none;width:52px;height:52px;border-radius:12px;background:#FF6D00;display:flex;align-items:center;justify-content:center">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span>${esc(c)}</li>`,
    )
    .join("");
  return shell(`${topBar(l)}
  <div style="position:absolute;top:130px;left:120px;right:120px">
    <div class="eyebrow">Checklist</div>
    <h2 style="font-size:52px;margin:10px 0 40px">Before you move on</h2>
    <ul style="list-style:none;display:flex;flex-direction:column;gap:30px">${items}</ul>
  </div>${draft}`);
}

function endFrame(l, next) {
  const line = next ? `Next lesson: ${esc(next.title)}` : "Course complete: now plan your own cassava plot";
  return shell(`
  <div style="position:absolute;inset:0;background:#000;color:#fff;display:grid;grid-template-columns:1.15fr 0.85fr">
    <div style="padding:0 60px 0 80px;display:flex;flex-direction:column;justify-content:center;gap:22px">
      <div class="logo d"><span class="jt">JT</span>JesTech Nexus</div>
      <h1 style="font-size:54px;line-height:1.12">${line}</h1>
      <p style="font-size:22px;color:rgba(255,255,255,.8)">Mark this lesson complete in the app to track your progress.</p>
    </div>
    <div>${heroArt()}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:26px;font-size:15px;color:rgba(255,255,255,.7);line-height:1.5;background:rgba(0,0,0,.6);padding:6px 0">
      Draft lesson, to be reviewed by agricultural specialists. Illustrations: JesTech. Narration: synthetic voice (Piper TTS, LibriTTS voice, CC BY 4.0).
    </div>
  </div>`);
}

/* --------------------------------------------------------------- build */

function speak(text, file) {
  execFileSync(PIPER, ["-m", MODEL, "-s", SPEAKER, "--length_scale", "1.15", "--sentence_silence", "0.3", "-f", file], {
    input: text,
    stdio: ["pipe", "ignore", "ignore"],
  });
  return Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());
}

const vttTime = (s) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${sec}.${String(ms % 1000).padStart(3, "0")}`;
};

async function buildLesson(browser, l, next) {
  const dir = path.join(WORK, l.slug);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  // Segment list: [html, narration, padAfterSeconds]
  const segs = [[titleFrame(l), l.intro, 0.9]];
  for (const scene of l.scenes) scene.points.forEach(([, say], k) => segs.push([stepFrame(l, scene, k), say, 0.6]));
  segs.push([recapFrame(l), `Before you move on, check: ${l.checklist.join(". ")}.`, 0.8]);
  segs.push([
    endFrame(l, next),
    next ? `In the next lesson: ${next.title}.` : "Well done. You have finished the course. Now complete the practical activity, and plan your own cassava plot.",
    1.5,
  ]);

  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const list = [];
  const audio = [];
  const cues = [];
  let t = 0;
  for (const [i, [html, say, pad]] of segs.entries()) {
    const png = path.join(dir, `f${String(i).padStart(2, "0")}.png`);
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: png });
    const wav = path.join(dir, `a${String(i).padStart(2, "0")}.wav`);
    const speech = speak(say, wav);
    const dur = Math.round((speech + pad) * 100) / 100;
    list.push(`file '${png}'`, `duration ${dur}`);
    audio.push([wav, dur]);
    cues.push(`${vttTime(t + 0.05)} --> ${vttTime(t + speech + 0.1)}\n${say}`);
    t += dur;
  }
  await page.close();
  list.push(`file '${path.join(dir, `f${String(segs.length - 1).padStart(2, "0")}.png`)}'`);
  writeFileSync(path.join(dir, "frames.txt"), list.join("\n"));

  // Audio: pad each narration to its slot, join, level the loudness.
  const inputs = audio.flatMap(([f]) => ["-i", f]);
  const filter =
    audio.map(([, d], i) => `[${i}:a]aresample=22050,apad=whole_dur=${d}[s${i}]`).join(";") +
    ";" +
    audio.map((_, i) => `[s${i}]`).join("") +
    `concat=n=${audio.length}:v=0:a=1,loudnorm=I=-16:TP=-1.5:LRA=11[out]`;
  const narration = path.join(dir, "narration.wav");
  execFileSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", filter, "-map", "[out]", "-ar", "22050", "-ac", "1", narration]);

  mkdirSync(OUT, { recursive: true });
  const mp4 = path.join(OUT, `${l.slug}.mp4`);
  execFileSync("ffmpeg", [
    "-y", "-v", "error",
    "-f", "concat", "-safe", "0", "-i", path.join(dir, "frames.txt"),
    "-i", narration,
    "-vf", `scale=960:540:flags=lanczos,fps=12,fade=t=in:st=0:d=0.4,fade=t=out:st=${(t - 0.5).toFixed(2)}:d=0.5,format=yuv420p`,
    "-c:v", "libx264", "-preset", "veryslow", "-tune", "stillimage", "-crf", "30", "-g", "120",
    "-c:a", "aac", "-b:a", "40k", "-ac", "1",
    "-movflags", "+faststart", "-shortest", mp4,
  ]);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", path.join(dir, "f00.png"), "-vf", "scale=640:360", "-q:v", "6", path.join(OUT, `${l.slug}.jpg`)]);
  writeFileSync(path.join(OUT, `${l.slug}.vtt`), `WEBVTT\n\n${cues.join("\n\n")}\n`);

  return { slug: l.slug, durationSec: Math.round(t), sizeBytes: statSync(mp4).size };
}

const only = process.argv.slice(2);
const browser = await chromium.launch();
const manifest = [];
for (const [i, l] of lessons.entries()) {
  if (only.length && !only.includes(l.slug)) continue;
  const r = await buildLesson(browser, l, lessons[i + 1]);
  manifest.push(r);
  console.error(`built ${r.slug}: ${r.durationSec}s, ${Math.round(r.sizeBytes / 1024)} KB`);
}
await browser.close();
console.log(JSON.stringify(manifest, null, 2));

// Keep src/db/lesson-videos.json (used by the seed and the data migration) in step with the files.
if (!only.length) {
  const out = {
    courseSlug: course.slug,
    credit: "Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).",
    lessons: Object.fromEntries(
      manifest.map((m) => {
        const base = `/videos/${course.slug}/${m.slug}`;
        return [m.slug, { videoUrl: `${base}.mp4`, videoPoster: `${base}.jpg`, videoCaptions: `${base}.vtt`, videoDurationSec: m.durationSec, videoSizeBytes: m.sizeBytes }];
      }),
    ),
  };
  writeFileSync(path.join(ROOT, "src/db/lesson-videos.json"), JSON.stringify(out, null, 2) + "\n");
}
