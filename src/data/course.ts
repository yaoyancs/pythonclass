import type { Lesson, LectureSpec } from '../types/scene';

/** 整门课统一元信息 */
export const COURSE = {
  id: 'python-programming',
  title: 'Python 程序设计',
  department: '计算机学院',
  teacher: '姚艳',
  university: '曲阜师范大学',
  totalLectures: 11,
  hoursPerLecture: 3,
} as const;

/** 首页/跳转用的讲次元信息（通常由开课表推导） */
export interface LectureMeta {
  id: string;
  number: number;
  title: string;
  /** 首页「课时」后的一句话说明 */
  blurb: string;
  hours: number;
  /** 是否已有可上课内容；false 时进入占位页 */
  ready: boolean;
}

export function lecturePath(id: string): string {
  return `/lesson/${id}`;
}

export function displaySubtitle(meta: Pick<LectureMeta, 'number' | 'title'>): string {
  return `第 ${meta.number} 讲 · ${meta.title}`;
}

export function lectureMetaFromSpec(spec: LectureSpec): LectureMeta {
  return {
    id: spec.id,
    number: spec.number,
    title: spec.title,
    blurb: spec.blurb,
    hours: spec.hours,
    ready: spec.ready,
  };
}

/** 尚未编写的讲次：给一页占位，保证路由可进 */
export function createPlaceholderLesson(
  meta: Pick<LectureSpec, 'id' | 'number' | 'title' | 'hours' | 'blurb'> | LectureMeta,
): Lesson {
  return {
    id: meta.id,
    number: meta.number,
    title: meta.title,
    subtitle: displaySubtitle(meta),
    hours: meta.hours,
    parts: [],
    sceneCount: 1,
    scenes: [
      {
        id: `${meta.id}-placeholder`,
        index: 1,
        title: '内容筹备中',
        type: 'explain',
        layout: 'fullscreen',
        content: {
          headline: displaySubtitle(meta),
          body: '本讲课件正在筹备中。可以先从首页进入第 1 讲。',
          bulletPoints: [
            `本讲共 ${meta.hours} 课时`,
            '完整互动课堂内容将在后续逐讲补齐',
          ],
        },
      },
    ],
  };
}
