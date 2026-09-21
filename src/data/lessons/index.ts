import type { Lesson } from '../../types/scene';
import { lectureMetaFromSpec, type LectureMeta } from '../course';
import { buildAllLessons, CURRENT_OFFERING } from '../offerings';

/** 首页与跳转讲次列表（来自当前学期开课表） */
export const LECTURES: LectureMeta[] = CURRENT_OFFERING.lectures.map(lectureMetaFromSpec);

/** 全部讲次内容注册表 */
export const LESSONS: Record<string, Lesson> = buildAllLessons();

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS[id];
}

export function getAllLessons(): Lesson[] {
  return LECTURES.map((meta) => LESSONS[meta.id]!).filter(Boolean);
}

export const lesson01 = LESSONS.lesson01!;
export const lesson02 = LESSONS.lesson02!;
