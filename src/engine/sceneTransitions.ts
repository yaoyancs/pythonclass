import type { Scene } from '../types/scene';
import type { ClassroomState, ScenePhase } from '../types/sceneState';

export function getInitialPhase(scene: Scene): ScenePhase {
  if (scene.prediction || scene.requiresPrediction) return 'predict';
  if (scene.type === 'aiReview') return 'initial';
  return 'initial';
}

export function canRun(scene: Scene, state: ClassroomState, pythonReady: boolean): boolean {
  if (!pythonReady || state.isRunning) return false;
  if (!scene.code) return false;
  if ((scene.prediction || scene.requiresPrediction) && !state.sceneLocal.predictionSubmitted) {
    return false;
  }
  return true;
}

export function canReveal(scene: Scene, state: ClassroomState): boolean {
  if (!scene.reveal) return false;
  if (state.sceneLocal.revealShown) return false;
  if (scene.type === 'explain' || scene.type === 'question' || scene.type === 'summary') {
    return true;
  }
  return state.sceneLocal.runCount > 0 || state.scenePhase === 'output';
}

export function canShowHint(scene: Scene, state: ClassroomState): boolean {
  if (!scene.hints?.length) return false;
  return state.sceneLocal.hintLevel < scene.hints.length;
}

export function canShowAI(scene: Scene, state: ClassroomState): boolean {
  if (!scene.aiReview) return false;
  if (!state.sceneLocal.aiUnlocked) return false;
  return true;
}

export function shouldUnlockAI(scene: Scene, state: ClassroomState): boolean {
  if (!scene.aiReview || state.sceneLocal.aiUnlocked) return false;
  const { unlockAfter } = scene.aiReview;
  const local = state.sceneLocal;
  if (unlockAfter === 'firstRun') return local.runCount >= 1;
  if (unlockAfter === 'predictionSubmitted') return local.predictionSubmitted;
  if (unlockAfter === 'errorObserved') return local.lastOutput?.error != null;
  if (unlockAfter === 'humanReviewDone') return local.humanReviewDone;
  return false;
}

export function getPhaseLabel(phase: ScenePhase, scene: Scene): string {
  const labels: Record<ScenePhase, string> = {
    initial: '讲授',
    question: '提问',
    predict: '预测',
    predictSubmitted: '等待验证',
    run: '运行',
    output: '观察输出',
    observe: '观察错误',
    hint: '提示',
    modify: '修改代码',
    success: '修复成功',
    humanReview: '人工审查',
    aiReview: 'AI 审查',
    reveal: '揭示',
    complete: '完成',
  };
  if (scene.type === 'break' && phase === 'initial') return '休息';
  return labels[phase] ?? phase;
}

export function sceneProgressPercent(currentIndex: number, total: number): number {
  return Math.round(((currentIndex + 1) / total) * 100);
}
