import { lectureHomeworkPath, lectureMetaFromSpec, findHomeworkSceneIndex } from '../../src/data/course';
import { offering2026S } from '../../src/data/offerings/2026S';
import { buildLesson } from '../../src/data/offerings/buildLesson';

describe('lecture homework', () => {
  it('is copied onto home-page lecture meta', () => {
    const spec = offering2026S.lectures.find((l) => l.id === 'lesson02');
    expect(spec?.homework?.items.length).toBeGreaterThan(0);
    expect(lectureMetaFromSpec(spec!).homework?.title).toBe(spec!.homework!.title);
  });

  it('overlays the 课后作业 scene from the offering spec', () => {
    const spec = offering2026S.lectures.find((l) => l.id === 'lesson01')!;
    const lesson = buildLesson(spec);
    const hw = lesson.scenes.find((s) => s.content.headline === '课后作业');
    expect(hw?.content.body).toBe(spec.homework?.title);
    expect(hw?.content.bulletPoints).toEqual(spec.homework?.items);
    expect(findHomeworkSceneIndex(lesson)).toBeGreaterThanOrEqual(0);
    expect(lectureHomeworkPath('lesson01')).toBe('/lesson/lesson01?page=homework');
  });
});
