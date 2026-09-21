import { useEffect, useRef } from 'react';
import { useSceneEngine } from '../engine/SceneEngine';
import { scheduleSceneView, trackHomeworkOpen, trackLessonView, trackSceneDwell } from './client';

const viewedLessons = new Set<string>();

export function useLessonAnalytics(): void {
  const { lesson, scene, state } = useSceneEngine();
  const enteredAt = useRef(Date.now());
  const ready = useRef(false);
  const current = useRef({
    lessonId: lesson.id,
    sceneIndex: state.currentSceneIndex,
    sceneId: scene.id,
    partId: scene.partId,
  });
  const dwellFlushed = useRef(false);

  const flushDwell = () => {
    if (dwellFlushed.current) return;
    dwellFlushed.current = true;
    const prev = current.current;
    const elapsed = (Date.now() - enteredAt.current) / 1000;
    trackSceneDwell({
      lessonId: prev.lessonId,
      sceneIndex: prev.sceneIndex,
      seconds: elapsed,
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
      enteredAt.current = Date.now();
      dwellFlushed.current = false;
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
      return;
    }

    flushDwell();
    enteredAt.current = Date.now();
    dwellFlushed.current = false;
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
  }, [lesson.id, state.currentSceneIndex, scene.id, scene.partId]);

  useEffect(() => {
    const onHide = () => flushDwell();
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      flushDwell();
    };
  }, []);
}
