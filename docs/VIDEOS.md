# Lesson videos

Every lesson in **How to Grow Cassava** has a short narrated video (32–51 seconds, 280–420 KB each,
3.4 MB for all nine). The files are in `public/videos/grow-cassava/`:

| File | Purpose |
| --- | --- |
| `<lesson>.mp4` | 960×540 H.264 video with mono AAC narration, built for mobile data |
| `<lesson>.jpg` | Poster image shown before the video plays |
| `<lesson>.vtt` | English subtitles, on by default |

## How learners see them

- The video sits at the top of the lesson. **Nothing is downloaded until the learner presses play.**
- The length and file size are shown up front, so learners know the data cost.
- **Save lesson and video offline** stores the lesson, the video, its poster and its subtitles on the device.
  The service worker then plays them without internet.

## Credits and rights

- **Illustrations and scripts:** JesTech. The scripts follow the lesson text and are a **draft pending review**
  by agricultural specialists. Every video says so on screen.
- **Narration:** synthetic voice from [Piper TTS](https://github.com/rhasspy/piper), using the **LibriTTS**
  voice. LibriTTS is licensed **CC BY 4.0**, so the credit appears under each video and on its end card.

## Adding or replacing a video (Admin)

In **Admin → Courses & lessons → (lesson) → Lesson video**, set:

- **Video link:** either a file under `/videos/...` or a **YouTube link**. A YouTube video loads in
  privacy-enhanced mode, and only after the learner taps it.
- **Poster, subtitles, length, file size and credit.**

Only use videos that JesTech owns or has written permission to share. Free farmer-training videos from
organisations such as Access Agriculture or IITA are good candidates once their terms have been checked.

## Rebuilding the videos (developers)

The videos are generated from `scripts/videos/cassava.mjs` (the narration and on-screen points) and
`scripts/videos/art.mjs` (the illustrations). After editing either:

```bash
# one-time setup (any folder outside the repo)
python3 -m venv tts && tts/bin/pip install piper-tts
curl -L -o libritts.tar.gz https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-en-us-libritts-high.tar.gz
tar -xzf libritts.tar.gz            # gives en-us-libritts-high.onnx (+ .json)

# build all nine (needs ffmpeg and Playwright with Chromium)
PIPER=tts/bin/piper PIPER_MODEL=en-us-libritts-high.onnx node scripts/videos/build.mjs
```

The build also rewrites `src/db/lesson-videos.json`, which the seed reads.

For an **existing database**, write a new migration that updates the changed lessons. Use
`drizzle/0002_lesson_videos_cassava_data.sql` as the pattern; it only fills lessons that have no video yet.
