import { useEffect } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { StringBoardContent } from '../../types/scene';

interface Props {
  content: StringBoardContent;
  sceneId: string;
}

interface SliceStep {
  code: string;
  caption: string;
  pick: (length: number) => number[];
  result: (word: string) => string;
  reverse?: boolean;
}

const SLICE_STEPS: SliceStep[] = [
  {
    code: 'word[:3]',
    caption: '含头不含尾：结束位置本身不取',
    pick: () => [0, 1, 2],
    result: (word) => word.slice(0, 3),
  },
  {
    code: 'word[3:]',
    caption: '从下标 3 取到末尾',
    pick: (length) => Array.from({ length }, (_, index) => index).filter((index) => index >= 3),
    result: (word) => word.slice(3),
  },
  {
    code: 'word[-3:]',
    caption: '从倒数第 3 个取到末尾',
    pick: (length) => Array.from({ length }, (_, index) => index).filter((index) => index >= length - 3),
    result: (word) => word.slice(-3),
  },
  {
    code: 'word[::2]',
    caption: '步长 2：每隔一个取一个',
    pick: (length) => Array.from({ length }, (_, index) => index).filter((index) => index % 2 === 0),
    result: (word) => [...word].filter((_, index) => index % 2 === 0).join(''),
  },
  {
    code: 'word[::-1]',
    caption: '步长 -1：从右往左整段倒过来',
    pick: (length) => Array.from({ length }, (_, index) => index),
    result: (word) => [...word].reverse().join(''),
    reverse: true,
  },
];

export function StringBoardStage({ content, sceneId }: Props) {
  const { state, dispatch } = useSceneEngine();
  const shownAtOnce = (content.examples?.length ?? 0) > 0;
  const maxPhase = content.mode === 'slice' ? 5 : content.mode === 'find' ? 2 : 3;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase, !shownAtOnce);
  const chars = [...content.word];
  const mark = content.mark ?? '';
  const sliceStep = content.mode === 'slice' && phase >= 1 ? SLICE_STEPS[phase - 1] : undefined;
  const active = new Set(activeIndexes(content.mode, phase, chars, mark));
  const showPositive = content.mode === 'find' ? false : content.mode !== 'index' || phase >= 1;
  const showNegative = content.mode === 'negative' ? phase >= 1 : content.mode === 'slice';
  const caption = captionFor(content.mode, phase, content.word, content.bindingName, mark);
  const findHits = content.mode === 'find' ? chars.reduce((count, char) => count + (char === mark ? 1 : 0), 0) : 0;

  useEffect(() => {
    if (content.mode !== 'find' || phase < 2 || !content.nextCode) return;
    if (state.sceneLocal.code !== content.nextCode) dispatch({ type: 'UPDATE_CODE', code: content.nextCode });
  }, [content.mode, content.nextCode, phase, state.sceneLocal.code, dispatch]);

  if (shownAtOnce) return <StaticStringBoard content={content} />;

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
        {content.bindingName && (
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="rounded-full bg-accent px-4 py-1 title-kai text-xl text-white">
              {content.bindingName}
            </span>
            <span className="text-2xl text-accent" aria-hidden>
              →
            </span>
            <span className="font-mono text-2xl text-text-primary">"{content.word}"</span>
          </div>
        )}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
        >
          {chars.map((char, index) => {
            const order =
              content.mode === 'find' && phase >= 2 && char === mark
                ? chars.slice(0, index + 1).filter((item) => item === mark).length
                : 0;
            return (
            <div key={`${char}-${index}`} className="text-center">
              {content.mode === 'find' && (
                <div className="mb-1 h-7 font-mono text-lg text-accent">{order > 0 ? order : ''}</div>
              )}
              <div
                className={`rounded-2xl border-2 py-3 font-mono text-3xl font-semibold transition-all ${
                  active.has(index)
                    ? 'border-accent bg-accent text-white shadow-card'
                    : 'border-classroom-border bg-white text-text-primary'
                }`}
              >
                {char}
              </div>
              {showPositive && (
                <div className="mt-2 font-mono text-lg text-text-secondary">{index}</div>
              )}
              {showNegative && (
                <div className="font-mono text-lg text-accent">{index - chars.length}</div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {content.mode === 'find' && phase >= 1 && (
        <div className="mt-4 rounded-3xl bg-accent-muted px-6 py-4 timeline-node-in">
          <p className="font-mono text-2xl text-text-primary">
            {phase >= 2 ? `line.count("${mark}") → ${findHits}` : `"${mark}" in line → True`}
          </p>
        </div>
      )}

      {caption && (
        <p className="mt-4 stage-emphasis text-xl timeline-node-in">{caption}</p>
      )}

      {sliceStep && (
        <div className="mt-4 rounded-3xl bg-accent-muted px-6 py-4 timeline-node-in">
          <p className="font-mono text-2xl text-text-primary">
            {sliceStep.code} → "{sliceStep.result(content.word)}"
          </p>
          <p className="mt-2 text-lg text-text-secondary">{sliceStep.caption}</p>
          {sliceStep.reverse && (
            <p className="mt-3 font-mono text-2xl tracking-[0.3em] text-accent">
              {[...sliceStep.result(content.word)].join('  ')}
            </p>
          )}
        </div>
      )}

      {!done && <p className="mt-4 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}

function StaticStringBoard({ content }: { content: StringBoardContent }) {
  const chars = [...content.word];
  const compact = chars.length > 8;
  const picks = new Set(content.examples?.flatMap((item) => item.pick ?? []) ?? []);
  const showNegative = content.mode === 'negative' || content.mode === 'reverse';

  return (
    <div className="mt-3 select-none">
      {content.lead && (
        <p className="title-kai text-lg leading-relaxed text-text-primary">{content.lead}</p>
      )}
      <div className="mt-3 rounded-3xl bg-classroom-stage px-3 py-4 shadow-card">
        {content.bindingName && (
          <p className="mb-3 text-center text-lg leading-relaxed text-text-primary">
            <span className="rounded-full bg-accent px-3 py-0.5 title-kai text-white">
              {content.bindingName}
            </span>
            <span className="mx-2 text-accent" aria-hidden>
              →
            </span>
            <span className="font-mono">"{content.word}"</span>
          </p>
        )}
        <div
          className={compact ? 'grid gap-1' : 'grid gap-2'}
          style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))` }}
        >
          {chars.map((char, index) => (
            <div key={`${char}-${index}`} className="text-center">
              <div
                className={`rounded-xl border-2 font-mono font-semibold ${
                  compact ? 'py-1.5 text-lg' : 'rounded-2xl py-3 text-3xl'
                } ${
                  picks.has(index)
                    ? 'border-accent bg-accent text-white'
                    : 'border-classroom-border bg-white text-text-primary'
                }`}
              >
                {char}
              </div>
              <div className={`mt-1 font-mono text-text-secondary ${compact ? 'text-[10px]' : 'text-lg'}`}>
                {index}
              </div>
              {showNegative && (
                <div className={`font-mono text-accent ${compact ? 'text-[10px]' : 'text-lg'}`}>
                  {index - chars.length}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {content.examples?.map((item) => (
          <li key={item.code} className="rounded-2xl bg-classroom-stage px-4 py-3 shadow-card">
            <p className="font-mono text-xl text-text-primary">
              {item.code}
              <span className="text-accent"> → "{item.result}"</span>
            </p>
            <p className="mt-1 text-base leading-relaxed text-text-secondary">{item.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function activeIndexes(
  mode: StringBoardContent['mode'],
  phase: number,
  chars: string[],
  mark: string,
): number[] {
  const length = chars.length;
  if (mode === 'index') {
    if (phase === 2) return [0];
    if (phase >= 3) return [2];
    return [];
  }
  if (mode === 'negative') {
    if (phase === 2) return [length - 1];
    if (phase >= 3) return [0];
    return [];
  }
  if (mode === 'find') {
    if (phase < 1 || !mark) return [];
    return chars.flatMap((char, index) => (char === mark ? [index] : []));
  }
  if (phase < 1) return [];
  return SLICE_STEPS[phase - 1]?.pick(length) ?? [];
}

function captionFor(
  mode: StringBoardContent['mode'],
  phase: number,
  word: string,
  bindingName: string | undefined,
  mark: string,
): string | null {
  const name = bindingName ?? 'word';
  if (mode === 'index') {
    if (phase === 2) {
      return `${name}[0] 是第 1 个字符 "${word[0]}"。相对起点偏移 0 个位置，所以索引是 0。`;
    }
    if (phase >= 3) {
      return `${name}[2] 是第 3 个字符 "${word[2]}"，从起点偏移了 2 个位置。第几个从 1 数，偏移几个位置从 0 数。`;
    }
    if (phase >= 1) return '索引是相对起点偏移了多少个位置，不是「第几个」。';
    return null;
  }
  if (mode === 'negative') {
    if (phase === 2) return `${word}[-1] 是 "${word[word.length - 1]}"，也就是最后一个字符。`;
    if (phase >= 3) return `下标 0 和 ${-word.length} 是同一个 "${word[0]}"。从左数和从右数，指的可以是同一格。`;
    if (phase >= 1) return '负数从右往左数，-1 是最后一个。';
    return '上面是从左往右的下标。';
  }
  if (mode === 'find') {
    const hits = [...word].filter((char) => char === mark).length;
    if (phase >= 2) return `count 沿着同一排数有几个：${hits}。`;
    if (phase >= 1) return 'in 只回答有没有，不回答有几个。';
    return mark ? `沿着这排字符找「${mark}」。` : null;
  }
  if (phase === 0) return '同一排字符，既能从左数，也能从右数。';
  return null;
}
