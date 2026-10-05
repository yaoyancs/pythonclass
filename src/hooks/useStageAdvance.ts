import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    __pyclassStageAdvance?: () => boolean;
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
  }, [sceneId]);

  const advance = useCallback(() => {
    if (phaseRef.current >= maxRef.current) return false;
    phaseRef.current += 1;
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
    return () => {
      delete window.__pyclassStageAdvance;
    };
  }, [advance, enabled]);

  return { phase, advance, reset, done: phase >= maxPhase };
}
