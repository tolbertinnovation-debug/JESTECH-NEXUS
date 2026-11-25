"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { formatBytes, formatDuration } from "@/lib/format";

export type LessonVideoData = {
  videoUrl: string;
  videoPoster: string | null;
  videoCaptions: string | null;
  videoDurationSec: number | null;
  videoSizeBytes: number | null;
  videoCredit: string | null;
};

function youTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com") || u.hostname.endsWith("youtube-nocookie.com")) {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] ?? null;
      return u.searchParams.get("v");
    }
  } catch {
    /* relative URL: not YouTube */
  }
  return null;
}

/**
 * Lesson video built for low bandwidth: nothing is downloaded until the learner presses play.
 * Self-hosted MP4s show duration and size up front and have captions on by default;
 * YouTube links load the privacy-enhanced player only after a tap.
 */
export function LessonVideo({ video, title }: { video: LessonVideoData; title: string }) {
  const [started, setStarted] = useState(false);
  const yt = youTubeId(video.videoUrl);
  const duration = formatDuration(video.videoDurationSec);
  const meta = [duration, video.videoSizeBytes ? formatBytes(video.videoSizeBytes) : null].filter(Boolean).join(" · ");
  const isExternal = /^https?:\/\//.test(video.videoUrl) && !yt;

  return (
    <figure className="overflow-hidden rounded-card border border-line bg-ink">
      <div className="relative aspect-video w-full">
        {yt ? (
          started ? (
            <iframe
              className="absolute inset-0 size-full"
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}?autoplay=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink text-paper"
              aria-label={`Play video: ${title}. Loads YouTube.`}
            >
              <PlayBadge />
              <span className="text-sm text-paper/80">Tap to load the video from YouTube (uses data)</span>
            </button>
          )
        ) : isExternal ? (
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-paper"
          >
            <PlayBadge />
            <span className="inline-flex items-center gap-1 text-sm text-paper/80">
              Watch on {new URL(video.videoUrl).hostname.replace(/^www\./, "")} <ExternalLink className="size-4" aria-hidden />
            </span>
          </a>
        ) : (
          <video
            className="absolute inset-0 size-full bg-ink object-contain"
            controls
            playsInline
            preload="none"
            poster={video.videoPoster ?? undefined}
            aria-label={title}
          >
            <source src={video.videoUrl} type="video/mp4" />
            {video.videoCaptions && <track kind="captions" src={video.videoCaptions} srcLang="en" label="English" default />}
            Your browser cannot play this video.{" "}
            <a href={video.videoUrl} className="underline">
              Download it instead
            </a>
            .
          </video>
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-paper px-4 py-2.5 text-xs text-subtle">
        <span className="font-semibold text-ink">
          Lesson video{meta && <span className="font-normal text-subtle"> · {meta}</span>}
        </span>
        {video.videoCaptions && !yt && <span>Subtitles on · loads only when you press play</span>}
        {video.videoCredit && <span className="w-full">{video.videoCredit}</span>}
      </figcaption>
    </figure>
  );
}

function PlayBadge() {
  return (
    <span className="inline-flex size-16 items-center justify-center rounded-full bg-brand text-ink shadow-lg transition-transform group-hover:scale-105">
      <Play className="ml-1 size-7 fill-current" aria-hidden />
    </span>
  );
}
