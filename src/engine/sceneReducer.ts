import type { Lesson, Scene } from '../types/scene';
import type {
  ClassroomAction,
  ClassroomState,
  SceneLocalState,
} from '../types/sceneState';
import { initialSceneLocalState } from '../types/sceneState';
import { getInitialPhase, shouldUnlockAI } from './sceneTransitions';

export function getSceneFromLesson(lesson: Lesson, index: number): Scene {
  return lesson.scenes[index]!;
}

function initSceneState(lesson: Lesson, index: number): ClassroomState {
  const scene = getSceneFromLesson(lesson, index);
  const code = scene.code?.initial ?? '';
  const phase = getInitialPhase(scene);
  const local = initialSceneLocalState(code);
  if (!scene.prediction && !scene.requiresPrediction) {
    local.runUnlocked = !!scene.code;
  }
  return {
    lessonId: lesson.id,
    currentSceneIndex: index,
    scenePhase: phase,
    sceneLocal: local,
    isFullscreen: false,
    editorFocused: false,
    isRunning: false,
  };
}

export function createInitialState(lesson: Lesson): ClassroomState {
  return initSceneState(lesson, 0);
}

function withScene(lesson: Lesson, index: number, prev: ClassroomState): ClassroomState {
  const next = initSceneState(lesson, index);
  return {
    ...next,
    isFullscreen: prev.isFullscreen,
  };
}

function applyRunComplete(state: ClassroomState, scene: Scene): ClassroomState {
  let local: SceneLocalState = { ...state.sceneLocal, runCount: state.sceneLocal.runCount + 1 };
  let phase = state.scenePhase;

  if (shouldUnlockAI(scene, { ...state, sceneLocal: local })) {
    local = { ...local, aiUnlocked: true };
  }

  if (scene.type === 'debug') {
    if (local.lastOutput?.error) {
      phase = 'observe';
    } else if (local.runCount > 1 || (local.hintLevel > 0 && !local.lastOutput?.error)) {
      phase = 'success';
    } else {
      phase = 'output';
    }
  } else {
    phase = 'output';
  }

  return {
    ...state,
    scenePhase: phase,
    sceneLocal: local,
    isRunning: false,
  };
}

export function sceneReducer(
  lesson: Lesson,
  state: ClassroomState,
  action: ClassroomAction,
): ClassroomState {
  const scene = getSceneFromLesson(lesson, state.currentSceneIndex);

  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'NEXT_SCENE': {
      if (state.currentSceneIndex >= lesson.scenes.length - 1) return state;
      return withScene(lesson, state.currentSceneIndex + 1, state);
    }

    case 'PREV_SCENE': {
      if (state.currentSceneIndex <= 0) return state;
      return withScene(lesson, state.currentSceneIndex - 1, state);
    }

    case 'GOTO_SCENE': {
      const index = Math.min(Math.max(action.index, 0), lesson.scenes.length - 1);
      if (index === state.currentSceneIndex) return state;
      return withScene(lesson, index, state);
    }

    case 'RESTART_SCENE':
      return withScene(lesson, state.currentSceneIndex, state);

    case 'SET_PHASE':
      return { ...state, scenePhase: action.phase };

    case 'SELECT_PREDICTION':
      return {
        ...state,
        sceneLocal: { ...state.sceneLocal, predictionSelected: action.optionId },
      };

    case 'SUBMIT_PREDICTION': {
      if (!state.sceneLocal.predictionSelected) return state;
      return {
        ...state,
        scenePhase: 'predictSubmitted',
        sceneLocal: {
          ...state.sceneLocal,
          predictionSubmitted: true,
          runUnlocked: true,
        },
      };
    }

    case 'RUN_START':
      return { ...state, isRunning: true, scenePhase: 'run' };

    case 'RUN_COMPLETE': {
      const next = {
        ...state,
        sceneLocal: {
          ...state.sceneLocal,
          lastOutput: action.result,
        },
      };
      return applyRunComplete(next, scene);
    }

    case 'RESET_CODE': {
      if (!scene.code?.resetToInitial) return state;
      return {
        ...state,
        sceneLocal: {
          ...state.sceneLocal,
          code: scene.code.initial,
          lastOutput: null,
        },
        scenePhase: scene.prediction ? 'predictSubmitted' : 'initial',
      };
    }

    case 'SHOW_HINT': {
      if (!scene.hints?.length) return state;
      const nextLevel = Math.min(state.sceneLocal.hintLevel + 1, scene.hints.length);
      return {
        ...state,
        scenePhase: 'hint',
        sceneLocal: { ...state.sceneLocal, hintLevel: nextLevel },
      };
    }

    case 'REVEAL':
      return {
        ...state,
        scenePhase: 'reveal',
        sceneLocal: { ...state.sceneLocal, revealShown: true },
      };

    case 'SHOW_AI_REVIEW':
      return {
        ...state,
        scenePhase: 'aiReview',
        sceneLocal: { ...state.sceneLocal, aiReviewShown: true },
      };

    case 'COMPLETE_HUMAN_REVIEW': {
      const local = { ...state.sceneLocal, humanReviewDone: true };
      const next = { ...state, scenePhase: 'humanReview' as const, sceneLocal: local };
      if (shouldUnlockAI(scene, next)) {
        return {
          ...next,
          sceneLocal: { ...local, aiUnlocked: true },
        };
      }
      return next;
    }

    case 'UPDATE_CODE':
      return {
        ...state,
        sceneLocal: { ...state.sceneLocal, code: action.code },
        scenePhase: state.scenePhase === 'output' ? 'modify' : state.scenePhase,
      };

    case 'SELECT_VOTE':
      return {
        ...state,
        sceneLocal: { ...state.sceneLocal, voteSelection: action.option },
      };

    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.value };

    case 'SET_EDITOR_FOCUSED':
      return { ...state, editorFocused: action.value };

    default:
      return state;
  }
}
