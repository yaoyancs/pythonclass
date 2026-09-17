import { describe, it, expect } from 'vitest';
import { createInitialState, sceneReducer } from '../../src/engine/sceneReducer';
import { lesson01 } from '../../src/data/lessons';

describe('sceneReducer', () => {
  it('starts at scene 1', () => {
    const state = createInitialState(lesson01);
    expect(state.currentSceneIndex).toBe(0);
    expect(lesson01.scenes[0]?.index).toBe(1);
  });

  it('navigates to next scene', () => {
    const state = createInitialState(lesson01);
    const next = sceneReducer(lesson01, state, { type: 'NEXT_SCENE' });
    expect(next.currentSceneIndex).toBe(1);
  });

  it('assigns part titles from offering parts', () => {
    const partScenes = lesson01.scenes.filter((s) => s.partId === '01');
    expect(partScenes.length).toBeGreaterThan(0);
    expect(partScenes.every((s) => s.title === 'AI 时代为什么学编程')).toBe(true);
  });

  it('builds catalog from offering parts', () => {
    expect(lesson01.parts.map((p) => p.index)).toEqual(['01', '02', '03', '04', '05']);
    const catalog = lesson01.scenes.find((s) => s.id === 'lesson01-catalog');
    expect(catalog?.content.catalog?.map((c) => c.index)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
    ]);
  });

  it('persists scene index via hydrate', () => {
    const state = createInitialState(lesson01);
    const moved = sceneReducer(lesson01, state, { type: 'NEXT_SCENE' });
    const hydrated = sceneReducer(lesson01, state, { type: 'HYDRATE', state: moved });
    expect(hydrated.currentSceneIndex).toBe(1);
  });
});
