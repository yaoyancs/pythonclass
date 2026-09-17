import type {
  DraftScene,
  LectureSpec,
  Lesson,
  Scene,
} from '../../types/scene';
import { getPart } from '../parts';

function subtitleFor(spec: Pick<LectureSpec, 'number' | 'title'>): string {
  return `第 ${spec.number} 讲 · ${spec.title}`;
}

function finalizeScene(
  draft: DraftScene,
  index: number,
  title: string,
  partId?: string,
): Scene {
  const { title: _ignored, ...rest } = draft;
  return {
    ...rest,
    index,
    title,
    ...(partId ? { partId } : {}),
  };
}

function catalogScene(spec: LectureSpec): DraftScene {
  return {
    id: `${spec.id}-catalog`,
    title: '本讲目录',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      body: `第 ${spec.number} 讲 · ${spec.title}　共 ${spec.hours} 课时`,
      catalog: spec.parts.map((p) => ({ index: p.id, title: p.title })),
    },
  };
}

/** 将开课表中的一讲 + 知识块仓库，组装为引擎使用的扁平 Lesson */
export function buildLesson(spec: LectureSpec): Lesson {
  const scenes: Scene[] = [];
  let index = 1;

  for (const preludeRef of spec.prelude ?? []) {
    const part = getPart(preludeRef);
    for (const draft of part.scenes) {
      const title = draft.title ?? part.id;
      scenes.push(finalizeScene(draft, index, title));
      index += 1;
    }
  }

  if (spec.parts.length > 0) {
    const catalog = catalogScene(spec);
    scenes.push(finalizeScene(catalog, index, catalog.title!));
    index += 1;
  }

  for (const partRef of spec.parts) {
    const part = getPart(partRef.ref);
    for (const draft of part.scenes) {
      scenes.push(finalizeScene(draft, index, partRef.title, partRef.id));
      index += 1;
    }
  }

  return {
    id: spec.id,
    number: spec.number,
    title: spec.title,
    subtitle: subtitleFor(spec),
    hours: spec.hours,
    parts: spec.parts.map((p) => ({ index: p.id, title: p.title })),
    sceneCount: scenes.length,
    scenes,
  };
}
