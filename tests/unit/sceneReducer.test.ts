import { describe, it, expect } from 'vitest';
import { createInitialState, sceneReducer } from '../../src/engine/sceneReducer';
import { lesson01 } from '../../src/data/lessons/lesson01';

describe('sceneReducer', () => {
  it('starts at scene 1', () => {
    const state = createInitialState(lesson01);
    expect(state.currentSceneIndex).toBe(0);
  });

  it('navigates to next scene', () => {
    const state = createInitialState(lesson01);
    const next = sceneReducer(lesson01, state, { type: 'NEXT_SCENE' });
    expect(next.currentSceneIndex).toBe(1);
  });

  it('blocks run before prediction submitted on predict scene', () => {
    let state = createInitialState(lesson01);
    const predictIndex = lesson01.scenes.findIndex((s) => s.requiresPrediction);
    expect(predictIndex).toBeGreaterThanOrEqual(0);
    while (state.currentSceneIndex !== predictIndex) {
      state = sceneReducer(lesson01, state, { type: 'NEXT_SCENE' });
    }
    expect(state.sceneLocal.predictionSubmitted).toBe(false);
    expect(state.sceneLocal.runUnlocked).toBe(false);
  });

  it('unlocks run after prediction submit', () => {
    let state = createInitialState(lesson01);
    const predictIndex = lesson01.scenes.findIndex((s) => s.requiresPrediction);
    while (state.currentSceneIndex !== predictIndex) {
      state = sceneReducer(lesson01, state, { type: 'NEXT_SCENE' });
    }
    state = sceneReducer(lesson01, state, { type: 'SELECT_PREDICTION', optionId: 'a' });
    state = sceneReducer(lesson01, state, { type: 'SUBMIT_PREDICTION' });
    expect(state.sceneLocal.predictionSubmitted).toBe(true);
    expect(state.sceneLocal.runUnlocked).toBe(true);
  });

  it('persists scene index via hydrate', () => {
    const state = createInitialState(lesson01);
    const moved = sceneReducer(lesson01, state, { type: 'NEXT_SCENE' });
    const hydrated = sceneReducer(lesson01, state, { type: 'HYDRATE', state: moved });
    expect(hydrated.currentSceneIndex).toBe(1);
  });
});
