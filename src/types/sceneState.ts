import type { PythonResult } from './python';

export type ScenePhase =
  | 'initial'
  | 'question'
  | 'predict'
  | 'predictSubmitted'
  | 'run'
  | 'output'
  | 'observe'
  | 'hint'
  | 'modify'
  | 'success'
  | 'humanReview'
  | 'aiReview'
  | 'reveal'
  | 'complete';

export interface SceneLocalState {
  predictionSelected: string | null;
  predictionSubmitted: boolean;
  runUnlocked: boolean;
  runCount: number;
  revealShown: boolean;
  hintLevel: number;
  aiUnlocked: boolean;
  aiReviewShown: boolean;
  humanReviewDone: boolean;
  code: string;
  lastOutput: PythonResult | null;
  voteSelection: string | null;
}

export interface ClassroomState {
  lessonId: string;
  currentSceneIndex: number;
  scenePhase: ScenePhase;
  sceneLocal: SceneLocalState;
  isFullscreen: boolean;
  editorFocused: boolean;
  isRunning: boolean;
}

export type ClassroomAction =
  | { type: 'NEXT_SCENE' }
  | { type: 'PREV_SCENE' }
  | { type: 'GOTO_SCENE'; index: number }
  | { type: 'RESTART_SCENE' }
  | { type: 'SET_PHASE'; phase: ScenePhase }
  | { type: 'SELECT_PREDICTION'; optionId: string }
  | { type: 'SUBMIT_PREDICTION' }
  | { type: 'RUN_START' }
  | { type: 'RUN_COMPLETE'; result: PythonResult }
  | { type: 'RESET_CODE' }
  | { type: 'SHOW_HINT' }
  | { type: 'REVEAL' }
  | { type: 'SHOW_AI_REVIEW' }
  | { type: 'COMPLETE_HUMAN_REVIEW' }
  | { type: 'UPDATE_CODE'; code: string }
  | { type: 'SELECT_VOTE'; option: string }
  | { type: 'SET_FULLSCREEN'; value: boolean }
  | { type: 'SET_EDITOR_FOCUSED'; value: boolean }
  | { type: 'HYDRATE'; state: ClassroomState };

export const initialSceneLocalState = (code = ''): SceneLocalState => ({
  predictionSelected: null,
  predictionSubmitted: false,
  runUnlocked: false,
  runCount: 0,
  revealShown: false,
  hintLevel: 0,
  aiUnlocked: false,
  aiReviewShown: false,
  humanReviewDone: false,
  code,
  lastOutput: null,
  voteSelection: null,
});
