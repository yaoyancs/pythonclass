import { useEffect, useRef } from 'react';
import { useSceneEngine } from '../engine/SceneEngine';
import {
  scheduleSceneView,
  trackHomeworkOpen,
  trackLessonComplete,
  trackLessonView,
  trackSceneDwell,
} from './client';

const viewedLessons = new Set<string>();

function isDocumentHidden(): boolean {
  return typeof document !== 'undefined' && document.visibilityState === 'hidden';
}

export function useLessonAnalytics(): void {
  const { lesson, scene, state } = useSceneEngine();
  const activeMs = useRef(0);
  const visibleSince = useRef<number | null>(isDocumentHidden() ? null : Date.now());
  const ready = useRef(false);
  const current = useRef({
    lessonId: lesson.id,
    sceneIndex: state.currentSceneIndex,
    sceneId: scene.id,
    partId: scene.partId,
  });
  const dwellFlushed = useRef(false);

  const resetDwellTimer = () => {
    activeMs.current = 0;
    visibleSince.current = isDocumentHidden() ? null : Date.now();
    dwellFlushed.current = false;
  };

  const flushDwell = () => {
    if (dwellFlushed.current) return;
    dwellFlushed.current = true;
    const now = Date.now();
    const totalMs =
      activeMs.current + (visibleSince.current != null ? Math.max(0, now - visibleSince.current) : 0);
    const prev = current.current;
    trackSceneDwell({
      lessonId: prev.lessonId,
      sceneIndex: prev.sceneIndex,
      seconds: totalMs / 1000,
      sceneId: prev.sceneId,
      partId: prev.partId,
    });
  };

  useEffect(() => {
    if (!viewedLessons.has(lesson.id)) {
      viewedLessons.add(lesson.id);
      trackLessonView(lesson.id);
    }
    try {
      if (new URLSearchParams(window.location.search).get('page') === 'homework') {
        trackHomeworkOpen(lesson.id);
      }
    } catch {
      // ignore
    }
  }, [lesson.id]);

  useEffect(() => {
    if (!ready.current) {
      ready.current = true;
      resetDwellTimer();
      current.current = {
        lessonId: lesson.id,
        sceneIndex: state.currentSceneIndex,
        sceneId: scene.id,
        partId: scene.partId,
      };
      scheduleSceneView({
        lessonId: lesson.id,
        sceneIndex: state.currentSceneIndex,
        sceneId: scene.id,
        partId: scene.partId,
      });
      if (state.currentSceneIndex >= lesson.scenes.length - 1) {
        trackLessonComplete({
          lessonId: lesson.id,
          sceneIndex: state.currentSceneIndex,
          sceneId: scene.id,
          partId: scene.partId,
        });
      }
      return;
    }

    flushDwell();
    resetDwellTimer();
    current.current = {
      lessonId: lesson.id,
      sceneIndex: state.currentSceneIndex,
      sceneId: scene.id,
      partId: scene.partId,
    };
    scheduleSceneView({
      lessonId: lesson.id,
      sceneIndex: state.currentSceneIndex,
      sceneId: scene.id,
      partId: scene.partId,
    });
    if (state.currentSceneIndex >= lesson.scenes.length - 1) {
      trackLessonComplete({
        lessonId: lesson.id,
        sceneIndex: state.currentSceneIndex,
        sceneId: scene.id,
        partId: scene.partId,
      });
    }
  }, [lesson.id, lesson.scenes.length, state.currentSceneIndex, scene.id, scene.partId]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const now = Date.now();
      if (document.visibilityState === 'hidden') {
        if (visibleSince.current != null) {
          activeMs.current += Math.max(0, now - visibleSince.current);
          visibleSince.current = null;
        }
      } else if (visibleSince.current == null) {
        visibleSince.current = now;
      }
    };
    const onHide = () => flushDwell();
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onHide);
      flushDwell();
    };
  }, []);
}
