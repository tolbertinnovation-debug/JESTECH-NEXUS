# Lessons and lesson videos

All **8 courses (51 lessons)** have full lesson text, a checklist and a short narrated video:

| Course | Lessons | Content lives in |
| --- | --- | --- |
| How to Grow Cassava (pilot) | 9 | `src/db/seed-data.ts` (text) + `scripts/videos/cassava.mjs` (video script) |
| AI Literacy and Applied AI | 6 | `src/db/content/ai-literacy.ts` |
| Web Development Fundamentals | 8 | `src/db/content/web-development.ts` |
| Cybersecurity Awareness | 5 | `src/db/content/cybersecurity.ts` |
| Data Analysis Basics | 6 | `src/db/content/data-analysis.ts` |
| Graphic Design Essentials | 7 | `src/db/content/graphic-design.ts` |
| Starting a Small Business | 5 | `src/db/content/small-business.ts` |
| Digital Literacy for Teachers | 5 | `src/db/content/teachers.ts` |

Each file in `src/db/content/` holds the lesson text, checklist and video script together, so a lesson and its video
always say the same thing. All lessons are **drafts pending review** by a JesTech subject reviewer. Each lesson and
each video says so.

## The video files

The video files are in `public/videos/<course>/`:

| File | Purpose |
| --- | --- |
| `<lesson>.mp4` | 960×540 H.264 video with mono AAC narration, built for mobile data (usually 250–500 KB) |
| `<lesson>.jpg` | Poster image shown before the video plays |
| `<lesson>.vtt` | English subtitles, on by default |

## How learners see them

- **Nothing is downloaded until the learner presses play.** The length and file size are shown up front.
- **Save lesson and video offline** stores the lesson, the video, its poster and its subtitles on the device.

## Credits and rights

- **Scripts and illustrations:** JesTech. Illustrations use icons from [Lucide](https://lucide.dev) (ISC licence).
- **Narration:** synthetic voice from [Piper TTS](https://github.com/rhasspy/piper), using the **LibriTTS** voice
  (**CC BY 4.0**). The credit appears under each video and on its end card.

## Adding or replacing a video (Admin)

In **Admin → Courses & lessons → (lesson) → Lesson video**, set:

- **Video link:** either a file under `/videos/...` or a **YouTube link**. A YouTube video loads in
  privacy-enhanced mode, and only after the learner taps it.
- **Poster, subtitles, length, file size and credit.**

Only use videos that JesTech owns or has written permission to share.

## Changing lessons or rebuilding videos (developers)

1. Edit the course file in `src/db/content/`.
2. Run `npm test`. It checks every lesson is complete and every illustration exists.
3. Rebuild the videos:

```bash
# one-time setup (any folder outside the repo)
python3 -m venv tts && tts/bin/pip install piper-tts
curl -L -o libritts.tar.gz https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-en-us-libritts-high.tar.gz
tar -xzf libritts.tar.gz            # gives en-us-libritts-high.onnx (+ .json)

# build everything, one course, or one lesson (needs ffmpeg and Playwright with Chromium)
export PIPER=tts/bin/piper PIPER_MODEL=en-us-libritts-high.onnx
npx tsx scripts/videos/build.mjs
npx tsx scripts/videos/build.mjs ai-literacy
npx tsx scripts/videos/build.mjs ai-literacy/what-ai-is
```

The build updates `src/db/lesson-videos.json`. A **fresh database** gets everything from `npm run db:seed`.

For **existing databases**, such as the live site, add a data migration:

```bash
npx drizzle-kit generate --custom --name lesson_updates
npx tsx scripts/gen-content-migration.ts drizzle/<new file>.sql
```

The generated migration never overwrites lessons or videos that an admin has edited. Vercel applies it on the
next deploy.
