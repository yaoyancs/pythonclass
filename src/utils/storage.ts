import type { ClassroomState } from '../types/sceneState';

function storageKey(lessonId: string): string {
  return `pyclass-${lessonId}-state`;
}

export function saveClassroomState(state: ClassroomState): void {
  try {
    const toSave: ClassroomState = {
      ...state,
      isRunning: false,
      editorFocused: false,
    };
    sessionStorage.setItem(storageKey(state.lessonId), JSON.stringify(toSave));
  } catch {
    // ignore quota errors
  }
}

export function loadClassroomState(lessonId: string): ClassroomState | null {
  try {
    const raw = sessionStorage.getItem(storageKey(lessonId));
    if (!raw) return null;
    return JSON.parse(raw) as ClassroomState;
  } catch {
    return null;
  }
}

export function clearClassroomState(lessonId: string): void {
  sessionStorage.removeItem(storageKey(lessonId));
}
