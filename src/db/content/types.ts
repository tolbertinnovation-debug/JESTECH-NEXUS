/**
 * Course content written as data: lesson text + checklist + narrated video script together,
 * so the website lesson and its video always say the same thing.
 * Each lesson's title is its module title; lesson slugs are derived from it.
 */
export type VideoScene = {
  /** Illustration key in scripts/videos/tech-art.mjs */
  art: string;
  heading: string;
  /** [on-screen text, narration] — one is revealed per narrated line */
  points: Array<[string, string]>;
};

export type LessonContent = {
  title: string;
  summary: string;
  minutes: number;
  /** Lesson markdown subset: paragraphs, ### headings, - bullets, **bold**, `code`, ``` fences */
  body: string;
  checklist: string[];
  video: { intro: string; scenes: VideoScene[] };
};

export type CourseContent = {
  slug: string;
  title: string;
  /** Shown on every video frame and at the end of each lesson */
  reviewNote: string;
  /** Final card / narration of the last lesson */
  finale: string;
  lessons: LessonContent[];
};

export const DRAFT_NOTE = "Draft lesson: to be checked by a JesTech subject reviewer before launch.";
