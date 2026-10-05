import { describe, it, expect } from 'vitest';
import { createInitialState, sceneReducer } from '../../src/engine/sceneReducer';
import { lesson01, lesson02 } from '../../src/data/lessons';

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
    expect(lesson01.parts.map((p) => p.index)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
    ]);
    const catalog = lesson01.scenes.find((s) => s.id === 'lesson01-catalog');
    expect(catalog?.content.catalog?.map((c) => c.index)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
    ]);
  });

  it('assembles lesson02 from type parts', () => {
    expect(lesson02.parts.map((p) => p.index)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
    ]);
    expect(lesson02.scenes.length).toBeGreaterThan(20);
    expect(lesson02.scenes.some((s) => s.id === 'lesson02-catalog')).toBe(true);
    expect(lesson02.scenes.filter((s) => s.partId === '01').every((s) => s.title === '变量')).toBe(
      true,
    );
  });

  it('reveals a string prediction after the code runs', () => {
    const index = lesson02.scenes.findIndex((scene) => scene.id === 'scene-str-08');
    const state = createInitialState(lesson02, index);
    expect(state.sceneLocal.runUnlocked).toBe(false);
    const selected = sceneReducer(lesson02, state, { type: 'SELECT_PREDICTION', optionId: 'typeerror' });
    const submitted = sceneReducer(lesson02, selected, { type: 'SUBMIT_PREDICTION' });
    const ran = sceneReducer(lesson02, submitted, {
      type: 'RUN_COMPLETE',
      result: { stdout: '', stderr: 'TypeError', error: { type: 'TypeError', message: 'does not support item assignment' } },
    });
    expect(ran.sceneLocal.revealShown).toBe(true);
    expect(ran.scenePhase).toBe('reveal');
  });

  it('persists scene index via hydrate', () => {
    const state = createInitialState(lesson01);
    const moved = sceneReducer(lesson01, state, { type: 'NEXT_SCENE' });
    const hydrated = sceneReducer(lesson01, state, { type: 'HYDRATE', state: moved });
    expect(hydrated.currentSceneIndex).toBe(1);
  });
});
