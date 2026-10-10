import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    __pyclassStageAdvance?: () => boolean;
    __pyclassStageRetreat?: () => boolean;
  }
}

let beatPhase = 0;
const beatPhaseListeners = new Set<() => void>();

export function publishBeatPhase(phase: number) {
  if (beatPhase === phase) return;
  beatPhase = phase;
  beatPhaseListeners.forEach((listener) => listener());
}

export function subscribeBeatPhase(listener: () => void) {
  beatPhaseListeners.add(listener);
  return () => beatPhaseListeners.delete(listener);
}

export function getBeatPhase() {
  return beatPhase;
}

/** 课堂分步动画：注册点击/空格/→ 推进，切场景时重置。 */
export function useStageAdvance(sceneId: string, maxPhase: number, enabled = true) {
  const [phase, setPhase] = useState(0);
  const phaseRef = useRef(0);
  const maxRef = useRef(maxPhase);
  maxRef.current = maxPhase;

  useEffect(() => {
    phaseRef.current = 0;
    setPhase(0);
    publishBeatPhase(0);
  }, [sceneId]);

  useEffect(() => {
    publishBeatPhase(phase);
  }, [phase]);

  const advance = useCallback(() => {
    if (phaseRef.current >= maxRef.current) return false;
    phaseRef.current += 1;
    setPhase(phaseRef.current);
    return true;
  }, []);

  const retreat = useCallback(() => {
    if (phaseRef.current <= 0) return false;
    phaseRef.current -= 1;
    setPhase(phaseRef.current);
    return true;
  }, []);

  const reset = useCallback(() => {
    phaseRef.current = 0;
    setPhase(0);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    window.__pyclassStageAdvance = () => advance();
    window.__pyclassStageRetreat = () => retreat();
    return () => {
      delete window.__pyclassStageAdvance;
      delete window.__pyclassStageRetreat;
    };
  }, [advance, retreat, enabled]);

  return { phase, advance, retreat, reset, done: phase >= maxPhase };
}
