import { useEffect } from 'react';
import type { TypeProbeContent } from '../../types/scene';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: TypeProbeContent;
  sceneId: string;
}

/** 0 四个字面量提问 → 1 对上类型 → 2 名字仍是 int → 3 引号换成 str */
export function TypeProbeStage({ content, sceneId }: Props) {
  const { dispatch } = useSceneEngine();
  const { phase, advance, done } = useStageAdvance(sceneId, 3);
  const showTypes = phase >= 1;
  const showName = phase >= 2;
  const code = showName ? content.nameCode : content.literalsCode;

  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);

  return (
    <div
      className="mt-3 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && advance()) event.preventDefault();
      }}
    >
      {showName ? (
        <NameFollow content={content} showQuote={phase >= 3} />
      ) : (
        <LiteralCards content={content} showTypes={showTypes} />
      )}
      {!done && <p className="mt-3 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}

function LiteralCards({ content, showTypes }: { content: TypeProbeContent; showTypes: boolean }) {
  return (
    <>
      <p className="title-kai text-xl leading-relaxed text-text-primary">{content.ask}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {content.literals.map((item) => (
          <div
            key={item.value}
            className="rounded-2xl border-2 border-dashed border-accent bg-white px-3 py-2 text-center"
          >
            <p className="font-mono text-2xl leading-none text-text-primary">{item.value}</p>
            <p className={`mt-1 text-base leading-none ${showTypes ? 'text-accent' : 'text-text-secondary'}`}>
              {showTypes ? `${item.type} · ${item.read}` : '？'}
            </p>
          </div>
        ))}
      </div>
      {showTypes && (
        <p className="mt-3 title-kai text-lg leading-relaxed text-text-secondary timeline-node-in">
          {content.classNote}
        </p>
      )}
    </>
  );
}

function NameFollow({ content, showQuote }: { content: TypeProbeContent; showQuote: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-2 shadow-card">
        <p className="font-mono text-lg text-text-primary">minutes = 18</p>
        <p className="font-mono text-lg text-accent">int</p>
      </div>
      <p className="title-kai text-lg leading-relaxed text-text-primary">{content.nameNote}</p>
      {showQuote && (
        <>
          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-2 shadow-card timeline-node-in">
            <p className="font-mono text-lg text-text-primary">{'minutes = "18"'}</p>
            <p className="font-mono text-lg text-accent">str</p>
          </div>
          <p className="rounded-3xl bg-accent-muted px-4 py-3 title-kai text-lg leading-relaxed text-text-primary timeline-node-in">
            {content.quoteNote}
          </p>
        </>
      )}
    </div>
  );
}
