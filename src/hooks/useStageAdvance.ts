import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    __pyclassStageAdvance?: () => boolean;
  }
}

/** 课堂分步动画：注册点击/空格/→ 推进，切场景时重置。 */
export function useStageAdvance(sceneId: string, maxPhase: number) {
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

  useEffect(() => {
    window.__pyclassStageAdvance = () => advance();
    return () => {
      delete window.__pyclassStageAdvance;
    };
  }, [advance]);

  return { phase, advance, done: phase >= maxPhase };
}
