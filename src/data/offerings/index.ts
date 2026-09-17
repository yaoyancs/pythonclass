import type { Lesson, LectureSpec } from "../../types/scene";
import { createPlaceholderLesson } from "../course";
import { offering2026S } from "./2026S";
import { buildLesson } from "./buildLesson";

/** 当前学期开课表；换学期时改这一行即可 */
export const CURRENT_OFFERING = offering2026S;

export function buildLessonFromSpec(spec: LectureSpec): Lesson {
  if (!spec.ready) {
    return createPlaceholderLesson(spec);
  }
  return buildLesson(spec);
}

export function buildAllLessons(): Record<string, Lesson> {
  return Object.fromEntries(
    CURRENT_OFFERING.lectures.map((spec) => [
      spec.id,
      buildLessonFromSpec(spec),
    ]),
  );
}

export { buildLesson, offering2026S };
