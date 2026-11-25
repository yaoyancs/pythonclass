import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { setStepCursor } from './StepRunStage';
import {
  buildStarSteps,
  packCounts,
  starExtQuiz,
  starQuiz,
  type StarControls,
  type StarKind,
  type StarStep,
} from '../../data/parts/fn-varargs/starFlow';

function CodePane({ step }: { step: StarStep }) {
  return (
    <pre className="m-0 overflow-auto rounded-xl bg-code-bg px-6 py-4 font-mono text-2xl leading-snug text-code-text">
      {step.code.split('\n').map((line, index) => {
        const active = index + 1 === step.line;
        const at = active ? line.indexOf(step.mark) : -1;
        return (
          <div key={`${index}-${line}`} className={active ? 'bg-white/15' : ''}>
            {at >= 0 ? (
              <>
                {line.slice(0, at)}
                <mark className="bg-orange-500 text-white">{step.mark}</mark>
                {line.slice(at + step.mark.length)}
              </>
            ) : (
              line || ' '
            )}
          </div>
        );
      })}
    </pre>
  );
}

const CHIP_H = 52;

function chipWidth(text: string) {
  return Math.max(88, text.length * 22 + 48);
}

function layoutStep(step: StarStep) {
  const frames = step.frames.map((frame) => ({ ...frame }));
  const chips = step.chips.map((chip) => ({ ...chip }));
  const hosted = new Map<string, { chip: (typeof chips)[number]; ox: number; oy: number }[]>();
  const loose: typeof chips = [];

  for (const chip of chips) {
    const host = frames.find(
      (frame) => chip.x >= frame.x && chip.x <= frame.x + frame.w && chip.y >= frame.y && chip.y <= frame.y + frame.h,
    );
    if (!host) loose.push(chip);
    else {
      const list = hosted.get(host.id) ?? [];
      list.push({ chip, ox: 0, oy: 0 });
      hosted.set(host.id, list);
    }
  }

  for (const frame of frames) {
    const list = (hosted.get(frame.id) ?? []).sort((a, b) => a.chip.x - b.chip.x);
    let x = 12;
    let y = 40;
    let widest = frame.w;
    for (const item of list) {
      const width = chipWidth(item.chip.text);
      if (x > 12 && x + width > 560) {
        x = 12;
        y += CHIP_H + 10;
      }
      item.ox = x;
      item.oy = y;
      x += width + 12;
      widest = Math.max(widest, x + 8);
    }
    frame.w = widest;
    frame.h = Math.max(frame.h, y + (list.length ? CHIP_H + 12 : 36));
  }

  const ordered = [...frames].sort((a, b) => a.y - b.y || a.x - b.x);
  for (let i = 0; i < ordered.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      const earlier = ordered[j]!;
      const later = ordered[i]!;
      const hitX = earlier.x < later.x + later.w + 8 && later.x < earlier.x + earlier.w + 8;
      const hitY = earlier.y < later.y + later.h + 8 && later.y < earlier.y + earlier.h + 8;
      if (hitX && hitY) {
        if (Math.abs(earlier.y - later.y) < 48) later.x = earlier.x + earlier.w + 16;
        else later.y = earlier.y + earlier.h + 16;
      }
    }
  }

  for (const frame of frames) {
    for (const item of hosted.get(frame.id) ?? []) {
      item.chip.x = frame.x + item.ox;
      item.chip.y = frame.y + item.oy;
    }
  }

  const rows: (typeof chips)[] = [];
  for (const chip of [...loose].sort((a, b) => a.y - b.y || a.x - b.x)) {
    const row = rows.find((item) => Math.abs(item[0]!.y - chip.y) < 48);
    if (row) row.push(chip);
    else rows.push([chip]);
  }
  for (const row of rows) {
    row.sort((a, b) => a.x - b.x);
    const y = Math.min(...row.map((chip) => chip.y));
    let x = 16;
    for (const chip of row) {
      chip.x = x;
      chip.y = y;
      x += chipWidth(chip.text) + 16;
    }
  }

  const maxX = Math.max(
    360,
    ...frames.map((frame) => frame.x + frame.w + 16),
    ...chips.map((chip) => chip.x + chipWidth(chip.text) + 16),
  );
  const maxY = Math.max(
    280,
    ...frames.map((frame) => frame.y + frame.h + 16),
    ...chips.map((chip) => chip.y + CHIP_H + 16),
  );
  return { frames, chips, maxX, maxY };
}

function Board({ step, prev }: { step: StarStep; prev?: StarStep }) {
  const laid = layoutStep(step);
  const before = prev ? layoutStep(prev) : undefined;
  const trails = laid.chips.flatMap((chip) => {
    const prior = before?.chips.find((item) => item.id === chip.id);
    if (!prior) return [];
    const x1 = prior.x + chipWidth(prior.text) / 2;
    const y1 = prior.y + CHIP_H / 2;
    const x2 = chip.x + chipWidth(chip.text) / 2;
    const y2 = chip.y + CHIP_H / 2;
    if (Math.abs(x1 - x2) < 4 && Math.abs(y1 - y2) < 4) return [];
    return [{ id: chip.id, x1, y1, x2, y2 }];
  });
  return (
    <div className="relative h-[32rem] w-full overflow-hidden rounded-xl border border-classroom-border bg-classroom-stage [container-type:size]">
      <svg viewBox={`0 0 ${laid.maxX} ${laid.maxY}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <marker id="star-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#c2410c" />
          </marker>
        </defs>
        {trails.map((arrow) => (
          <line key={arrow.id} x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} stroke="#c2410c" strokeWidth="2" markerEnd="url(#star-arrow)" />
        ))}
        {laid.frames.map((frame) => (
          <rect
            key={frame.id}
            x={frame.x}
            y={frame.y}
            width={frame.w}
            height={frame.h}
            rx={frame.kind === 'list' ? 10 : 2}
            fill="none"
            stroke={frame.hot ? '#ea580c' : '#047857'}
            strokeWidth={frame.kind === 'tuple' ? 3 : 2}
          />
        ))}
      </svg>
      {laid.frames.map((frame) => (
        <div
          key={frame.id}
          className="pointer-events-none absolute truncate px-2 pt-1 font-mono leading-none text-emerald-800"
          style={{
            left: `${(frame.x / laid.maxX) * 100}%`,
            top: `${(frame.y / laid.maxY) * 100}%`,
            width: `${(frame.w / laid.maxX) * 100}%`,
            fontSize: `min(22px, ${(16 / laid.maxX) * 100}cqw)`,
          }}
        >
          {frame.label}
        </div>
      ))}
      {laid.chips.map((chip) => (
        <div
          key={chip.id}
          className="absolute box-border flex items-center justify-center overflow-hidden whitespace-nowrap rounded-lg bg-sky-700 px-2 font-mono leading-none text-white"
          style={{
            left: `${(chip.x / laid.maxX) * 100}%`,
            top: `${(chip.y / laid.maxY) * 100}%`,
            width: `${(chipWidth(chip.text) / laid.maxX) * 100}%`,
            height: `${(CHIP_H / laid.maxY) * 100}%`,
            fontSize: `min(30px, ${(26 / laid.maxX) * 100}cqw)`,
            transition: 'left 500ms ease, top 500ms ease',
            opacity: chip.copy ? 0.95 : 1,
          }}
        >
          {chip.text}
        </div>
      ))}
    </div>
  );
}

function Player({
  steps,
  extra,
}: {
  steps: StarStep[];
  extra?: ReactNode;
}) {
  const { scene, dispatch } = useSceneEngine();
  const linked = Boolean(scene.code);
  const synced = useRef('');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[Math.min(index, Math.max(steps.length - 1, 0))];

  useEffect(() => {
    if (!linked || !step) return;
    if (synced.current !== step.code) {
      synced.current = step.code;
      dispatch({ type: 'UPDATE_CODE', code: step.code });
    }
    setStepCursor(scene.id, step.line);
  }, [linked, step, scene.id, dispatch]);

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing || !step) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setIndex((value) => value + 1), 1700);
    return () => window.clearTimeout(timer);
  }, [playing, index, steps.length, step]);

  if (!step) return null;
  const go = (next: number) => {
    setPlaying(false);
    setIndex(next);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {linked ? null : <CodePane step={step} />}
      <Board step={step} prev={steps[index - 1]} />
      <div className="space-y-2">
        {step.error ? <p className="font-mono text-lg text-error">{step.error}</p> : null}
        {step.output ? <pre className="m-0 font-mono text-lg text-text-primary">{step.output}</pre> : null}
        <p className="text-lg text-text-primary">{step.note}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="rounded-lg border border-classroom-border px-3 py-1" disabled={index <= 0} onClick={() => go(index - 1)}>上一步</button>
          <button type="button" className="rounded-lg border border-classroom-border px-3 py-1" disabled={index >= steps.length - 1} onClick={() => go(index + 1)}>下一步</button>
          <button type="button" className="rounded-lg bg-accent px-3 py-1 text-white" onClick={() => setPlaying((value) => !value)}>{playing ? '暂停' : '自动播放'}</button>
          <button type="button" className="rounded-lg border border-classroom-border px-3 py-1" onClick={() => go(0)}>重置</button>
          <span className="font-mono text-base text-text-secondary">{index + 1} / {steps.length}</span>
          {extra}
        </div>
      </div>
    </div>
  );
}

function Quiz({ which }: { which: 'call' | 'ext' }) {
  const { scene, dispatch } = useSceneEngine();
  const items = useMemo(() => (which === 'ext' ? starExtQuiz() : starQuiz()), [which]);
  const [cursor, setCursor] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const item = items[cursor]!;
  const picked = picks[item.id];
  const correctCount = items.filter((question) => picks[question.id] === question.answer).length;
  const done = items.every((question) => picks[question.id]);

  useEffect(() => {
    if (!scene.code || picked) return;
    dispatch({ type: 'UPDATE_CODE', code: item.code });
  }, [item.code, picked, scene.code, dispatch]);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-4 text-base text-text-secondary">
        <span>{cursor + 1} / {items.length}</span>
        <span>答对 {correctCount}</span>
        <div className="h-2 flex-1 rounded bg-classroom-border">
          <div className="h-2 rounded bg-accent" style={{ width: `${((cursor + (picked ? 1 : 0)) / items.length) * 100}%` }} />
        </div>
      </div>
      {scene.code ? null : <pre className="m-0 rounded-xl bg-code-bg px-6 py-4 font-mono text-2xl leading-snug text-code-text">{item.code}</pre>}
      <div className="flex flex-wrap gap-2">
        {item.options.map((option) => {
          const chosen = picked === option.id;
          const reveal = picked != null;
          const tone = !reveal ? 'border-classroom-border' : option.id === item.answer ? 'border-emerald-600 text-emerald-800' : chosen ? 'border-red-600 text-red-700' : 'border-classroom-border';
          return (
            <button key={option.id} type="button" className={`rounded-lg border px-6 py-3 font-mono text-3xl ${tone}`} onClick={() => setPicks((prev) => ({ ...prev, [item.id]: option.id }))}>
              {option.label}
            </button>
          );
        })}
      </div>
      {picked && <p className="text-lg text-text-primary">{picked === item.answer ? '正确。' : '不正确。'}{item.why}</p>}
      {picked && <Player key={`${item.id}-${picked}`} steps={item.steps} />}
      <div className="mt-auto flex gap-2">
        <button type="button" className="rounded-lg border border-classroom-border px-3 py-1" disabled={cursor <= 0} onClick={() => setCursor((value) => value - 1)}>上一题</button>
        <button type="button" className="rounded-lg border border-classroom-border px-3 py-1" disabled={cursor >= items.length - 1} onClick={() => setCursor((value) => value + 1)}>下一题</button>
        <button type="button" className="rounded-lg border border-classroom-border px-3 py-1" onClick={() => { setCursor(0); setPicks({}); }}>重新答题</button>
      </div>
      {done && (
        <div className="text-lg text-text-primary">
          <p>完成 {correctCount} / {items.length}。</p>
          {items.filter((question) => picks[question.id] !== question.answer).map((question) => (
            <p key={question.id}>{question.gap}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function choice(label: string, on: boolean, onClick: () => void) {
  return (
    <button key={label} type="button" className={`rounded-lg border px-2 py-1 text-sm ${on ? 'border-accent text-accent' : 'border-classroom-border'}`} onClick={onClick}>
      {label}
    </button>
  );
}

export function StarFlowStage({ kind }: { kind: StarKind }) {
  const [controls, setControls] = useState<StarControls>({ count: 3, mode: 'spread' });
  const steps = useMemo(() => buildStarSteps(kind, controls), [kind, controls]);
  if (kind === 'quiz') return <Quiz which="call" />;
  if (kind === 'extquiz') return <Quiz which="ext" />;

  const extra = (
    <>
      {(kind === 'pack' || kind === 'kwargs') && packCounts().filter((count) => kind === 'pack' || count <= 4).map((count) => choice(`${count}个`, controls.count === count, () => setControls((prev) => ({ ...prev, count }))))}
      {kind === 'unpack' && (
        <>
          {choice('add(*nums)', controls.mode === 'spread', () => setControls((prev) => ({ ...prev, mode: 'spread' })))}
          {choice('print(nums)', controls.mode === 'whole', () => setControls((prev) => ({ ...prev, mode: 'whole' })))}
          {choice('print(*nums)', controls.mode === 'echo', () => setControls((prev) => ({ ...prev, mode: 'echo' })))}
          {choice('*(1,2,3)', controls.mode === 'tuple', () => setControls((prev) => ({ ...prev, mode: 'tuple' })))}
          {choice('*"ABC"', controls.mode === 'str', () => setControls((prev) => ({ ...prev, mode: 'str' })))}
          {choice('*range', controls.mode === 'range', () => setControls((prev) => ({ ...prev, mode: 'range' })))}
          {choice('*dict', controls.mode === 'dictstar', () => setControls((prev) => ({ ...prev, mode: 'dictstar' })))}
          {choice('*123', controls.mode === 'bad', () => setControls((prev) => ({ ...prev, mode: 'bad' })))}
        </>
      )}
      {kind === 'compare' && choice('先拆再收', controls.mode === 'keyword', () => setControls((prev) => ({ ...prev, mode: controls.mode === 'keyword' ? 'spread' : 'keyword' })))}
      {kind === 'kwunpack' && (
        <>
          {choice('f(**data)', controls.mode === 'spread', () => setControls((prev) => ({ ...prev, mode: 'spread' })))}
          {choice('print(*data)', controls.mode === 'whole', () => setControls((prev) => ({ ...prev, mode: 'whole' })))}
          {choice('重复键', controls.mode === 'bad', () => setControls((prev) => ({ ...prev, mode: 'bad' })))}
        </>
      )}
      {kind === 'mixed' && (
        <>
          {choice('a, b, *args', controls.mode !== 'keyword', () => setControls((prev) => ({ ...prev, mode: 'spread' })))}
          {choice('a, *args, b', controls.mode === 'keyword', () => setControls((prev) => ({ ...prev, mode: 'keyword' })))}
          {choice('单独的 *', controls.mode === 'tail', () => setControls((prev) => ({ ...prev, mode: 'tail' })))}
        </>
      )}
      {kind === 'bench' && [0, 1, 2, 3, 4, 5, 6, 7].map((index) => choice(String(index + 1), controls.count === index, () => setControls((prev) => ({ ...prev, count: index }))))}
      {kind === 'dictmerge' && choice('调用重复键', controls.mode === 'bad', () => setControls((prev) => ({ ...prev, mode: controls.mode === 'bad' ? 'spread' : 'bad' })))}
      {kind === 'assign' && (
        <>
          {choice('*a, b, c', controls.mode === 'head', () => setControls((prev) => ({ ...prev, mode: 'head' })))}
          {choice('a, *b, c', controls.mode === 'mid' || controls.mode === 'spread', () => setControls((prev) => ({ ...prev, mode: 'mid' })))}
          {choice('a, b, *c', controls.mode === 'tail', () => setControls((prev) => ({ ...prev, mode: 'tail' })))}
        </>
      )}
    </>
  );

  return (
    <div className="h-full overflow-auto p-4">
      <Player steps={steps} extra={extra} />
    </div>
  );
}
