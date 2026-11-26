import { aiLiteracy } from "./ai-literacy";
import { cybersecurity } from "./cybersecurity";
import { dataAnalysis } from "./data-analysis";
import { graphicDesign } from "./graphic-design";
import { smallBusiness } from "./small-business";
import { teachers } from "./teachers";
import type { CourseContent } from "./types";
import { webDevelopment } from "./web-development";

/** Full lessons (text, checklist and video script) for every course except the Cassava pilot. */
export const courseContent: CourseContent[] = [
  aiLiteracy,
  webDevelopment,
  cybersecurity,
  dataAnalysis,
  graphicDesign,
  smallBusiness,
  teachers,
];

export function contentFor(slug: string): CourseContent | undefined {
  return courseContent.find((c) => c.slug === slug);
}

/** Same slug rule as the seed: "Passwords and 2-step verification" -> "passwords-and-2-step-verification". */
export function lessonSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type { CourseContent, LessonContent, VideoScene } from "./types";
