import { useEffect } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { StringCutContent } from '../../types/scene';

interface Props {
  content: StringCutContent;
  sceneId: string;
}

const RANGE_STYLES = [
  'border-accent bg-accent text-white',
  'border-amber-600 bg-amber-100 text-text-primary',
  'border-sky-700 bg-sky-100 text-text-primary',
];

export function StringCutStage({ content, sceneId }: Props) {
  const { dispatch } = useSceneEngine();
  const { phase, advance, done } = useStageAdvance(sceneId, 2);
  const sample = phase >= 1 ? content.shifted : content.fitted;
  const code = content.codes[Math.min(phase, 2)] ?? content.codes[0];

  useEffect(() => {
    if (phase < 1) return;
    dispatch({ type: 'UPDATE_CODE', code });
  }, [phase, code, dispatch]);

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
      <div className="rounded-3xl bg-classroom-stage shadow-card px-4 py-6">
        {phase < 2 ? (
          <>
            <CharRow text={sample.text} ranges={sample.ranges} />
            <p className="mt-4 text-center font-mono text-2xl text-text-primary">
              {sample.ranges.map(([start, end]) => sample.text.slice(start, end)).join('  |  ')}
            </p>
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {content.words.map((word, index) => (
              <div
                key={`${word}-${index}`}
                className={`rounded-2xl border-2 px-5 py-3 font-mono text-3xl font-semibold timeline-node-in ${RANGE_STYLES[index % RANGE_STYLES.length]}`}
              >
                {word}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="mt-4 stage-emphasis text-xl timeline-node-in">
        {phase >= 2
          ? content.close
          : phase >= 1
            ? '同一组下标，句子一长就切错。词的边界是空白，不是写死的位置。'
            : '这三个词能按下标切开。位置是数出来的。'}
      </p>
      {!done && <p className="mt-4 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}

function CharRow({ text, ranges }: { text: string; ranges: [number, number][] }) {
  const chars = [...text];
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
    >
      {chars.map((char, index) => {
        const hit = ranges.findIndex(([start, end]) => index >= start && index < end);
        return (
          <div
            key={`${char}-${index}`}
            className={`rounded-xl border-2 py-2 text-center font-mono text-xl font-semibold ${
              hit >= 0 ? RANGE_STYLES[hit % RANGE_STYLES.length] : 'border-classroom-border bg-white text-text-secondary'
            }`}
          >
            {char === ' ' ? '·' : char}
          </div>
        );
      })}
    </div>
  );
}
