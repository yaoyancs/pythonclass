import { useEffect } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { StringCastContent } from '../../types/scene';

interface Props {
  content: StringCastContent;
  sceneId: string;
}

/** 预测并运行之后，才把「18」这两个字符画成整数。 */
export function StringCastStage({ content, sceneId }: Props) {
  const { state, dispatch } = useSceneEngine();
  const unlocked = state.sceneLocal.runCount >= 1;
  const { phase, advance, done } = useStageAdvance(sceneId, 2, unlocked);
  const digits = [...content.digits];

  useEffect(() => {
    if (!unlocked || phase < 2 || state.sceneLocal.code === content.code) return;
    dispatch({ type: 'UPDATE_CODE', code: content.code });
  }, [unlocked, phase, content.code, state.sceneLocal.code, dispatch]);

  if (!unlocked) return null;

  return (
    <div
      className="mt-4 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && advance()) event.preventDefault();
      }}
    >
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-3xl bg-classroom-stage px-6 py-6 shadow-card">
        <div className="flex gap-2">
          {digits.map((digit, index) => (
            <div
              key={`${digit}-${index}`}
              className="rounded-2xl border-2 border-classroom-border bg-white px-4 py-3 text-center"
            >
              <div className="font-mono text-4xl font-semibold">{digit}</div>
              <div className="mt-1 text-sm text-text-secondary">字符</div>
            </div>
          ))}
        </div>
        {phase >= 1 && (
          <>
            <span className="text-3xl text-accent timeline-node-in" aria-hidden>
              →
            </span>
            <div className="rounded-full bg-accent px-6 py-3 text-center text-white timeline-node-in">
              <div className="font-mono text-4xl font-semibold">{content.digits}</div>
              <div className="mt-1 text-sm">整数</div>
            </div>
          </>
        )}
        {phase >= 2 && (
          <p className="font-mono text-3xl text-text-primary timeline-node-in">
            × {content.factor} → {content.product}
          </p>
        )}
      </div>
      <p className="mt-4 stage-emphasis text-xl timeline-node-in">
        {phase >= 2 ? content.line : phase >= 1 ? `int() 把字符 "${content.digits}" 转成整数 ${content.digits}。` : '看起来像分钟，其实是两格字符。'}
      </p>
      {!done && <p className="mt-4 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
