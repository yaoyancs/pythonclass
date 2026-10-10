import { useEffect } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { StringTemplateContent } from '../../types/scene';

interface Props {
  content: StringTemplateContent;
  sceneId: string;
}

export function StringTemplateStage({ content, sceneId }: Props) {
  const { dispatch } = useSceneEngine();
  const { phase, advance, done } = useStageAdvance(sceneId, 2);

  useEffect(() => {
    if (phase < 2) return;
    dispatch({ type: 'UPDATE_CODE', code: content.formatCode });
  }, [phase, content.formatCode, dispatch]);

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
      <div className="rounded-3xl bg-classroom-stage shadow-card px-6 py-6">
        {phase === 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-2xl">
            {content.pieces.map((piece, index) => (
              <span key={`${piece}-${index}`} className="flex items-center gap-2">
                {index > 0 && <span className="text-accent">+</span>}
                <span className="rounded-2xl border-2 border-accent bg-white px-3 py-2">{piece}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="flex flex-wrap items-center justify-center font-mono text-3xl text-text-primary">
            {content.gaps.map((gap, index) => (
              <span key={`${gap}-${index}`} className="flex items-center gap-1">
                {gap && <span>{gap}</span>}
                {content.slots[index] && (
                  <span
                    className={`rounded-2xl border-2 border-dashed px-3 py-1 ${
                      phase >= 2 ? 'border-accent bg-accent text-white' : 'border-accent/50 text-accent'
                    }`}
                  >
                    {phase >= 2 ? content.slots[index].value : `{${content.slots[index].name}}`}
                  </span>
                )}
              </span>
            ))}
          </p>
        )}
      </div>
      <p className="mt-4 stage-emphasis text-xl timeline-node-in">
        {phase >= 2
          ? 'f-string 也是在造一排新的字符。花括号里放已经整理好的名字。'
          : phase >= 1
            ? '同一句，把要填的位置留出来。'
            : '用加号把几段接成一句。'}
      </p>
      {phase >= 2 &&
        content.lines.map((line) => (
          <p key={line} className="mt-3 stage-emphasis text-xl text-text-primary timeline-node-in">
            {line}
          </p>
        ))}
      {!done && <p className="mt-4 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
