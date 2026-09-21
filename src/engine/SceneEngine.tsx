import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { createInitialState, getSceneFromLesson, sceneReducer } from './sceneReducer';
import type { ClassroomAction, ClassroomState } from '../types/sceneState';
import { loadClassroomState, saveClassroomState } from '../utils/storage';
import type { Lesson, Scene } from '../types/scene';

interface SceneEngineContextValue {
  state: ClassroomState;
  dispatch: React.Dispatch<ClassroomAction>;
  scene: Scene;
  lesson: Lesson;
}

const SceneEngineContext = createContext<SceneEngineContextValue | null>(null);

export function SceneEngineProvider({
  lesson,
  children,
  initialSceneIndex,
}: {
  lesson: Lesson;
  children: ReactNode;
  /** 指定则从该页开始（封面作业链），忽略本讲已保存进度的页码 */
  initialSceneIndex?: number;
}) {
  const [state, dispatch] = useReducer(
    (prev: ClassroomState, action: ClassroomAction) => sceneReducer(lesson, prev, action),
    undefined,
    () => {
      if (initialSceneIndex != null) {
        return createInitialState(lesson, initialSceneIndex);
      }
      const saved = loadClassroomState(lesson.id);
      if (saved && saved.lessonId === lesson.id) {
        const maxIndex = lesson.scenes.length - 1;
        const index = Math.min(Math.max(saved.currentSceneIndex, 0), maxIndex);
        return { ...saved, currentSceneIndex: index, isRunning: false, editorFocused: false };
      }
      return createInitialState(lesson);
    },
  );

  useEffect(() => {
    saveClassroomState(state);
  }, [state]);

  const scene = getSceneFromLesson(lesson, state.currentSceneIndex);

  const value = useMemo(
    () => ({ state, dispatch, scene, lesson }),
    [state, scene, lesson],
  );

  return (
    <SceneEngineContext.Provider value={value}>{children}</SceneEngineContext.Provider>
  );
}

export function useSceneEngine(): SceneEngineContextValue {
  const ctx = useContext(SceneEngineContext);
  if (!ctx) throw new Error('useSceneEngine must be used within SceneEngineProvider');
  return ctx;
}
