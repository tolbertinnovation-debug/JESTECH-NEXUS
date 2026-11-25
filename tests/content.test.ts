import { describe, expect, it } from "vitest";
import { courseContent, lessonSlug } from "@/db/content";
import { techArt } from "../scripts/videos/tech-art.mjs";

describe("course content", () => {
  it("covers the seven non-pilot courses", () => {
    expect(courseContent.map((c) => c.slug).sort()).toEqual(
      [
        "ai-literacy",
        "cybersecurity-awareness",
        "data-analysis-basics",
        "digital-literacy-for-teachers",
        "graphic-design-essentials",
        "start-a-small-business",
        "web-development-fundamentals",
      ].sort(),
    );
  });

  for (const course of courseContent) {
    describe(course.slug, () => {
      it("has unique lesson slugs", () => {
        const slugs = course.lessons.map((l) => lessonSlug(l.title));
        expect(new Set(slugs).size).toBe(slugs.length);
      });

      for (const l of course.lessons) {
        it(`${l.title}: complete lesson and video script`, () => {
          expect(l.summary.length).toBeGreaterThan(20);
          expect(l.body.length).toBeGreaterThan(400);
          expect(l.body).not.toMatch(/This lesson introduces/); // no outline placeholder text
          expect(l.checklist.length).toBeGreaterThanOrEqual(3);
          expect(l.checklist.length).toBeLessThanOrEqual(4);
          expect(l.video.intro.length).toBeGreaterThan(20);
          expect(l.video.scenes.length).toBeGreaterThan(0);
          for (const s of l.video.scenes) {
            expect(Object.keys(techArt), `illustration "${s.art}"`).toContain(s.art);
            expect(s.points.length).toBeGreaterThan(0);
            expect(s.points.length).toBeLessThanOrEqual(5);
          }
          // Fenced code blocks must be closed.
          expect((l.body.match(/```/g) ?? []).length % 2).toBe(0);
        });
      }
    });
  }
});
