import { useEffect, useState, useSyncExternalStore } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { BranchContestContent } from '../../types/scene';

interface Props {
  content: BranchContestContent;
  sceneId: string;
}

type ItemId = 'banana' | 'can' | 'durian';
type BinId = 'kitchen' | 'recycle' | 'harm' | 'other';

const ITEMS: { id: ItemId; name: string; mark: string; bin: BinId; src: string }[] = [
  { id: 'banana', name: '香蕉皮', mark: '蕉', bin: 'kitchen', src: '/lesson03/waste-banana.jpg' },
  { id: 'can', name: '易拉罐', mark: '罐', bin: 'recycle', src: '/lesson03/waste-can.jpg' },
  { id: 'durian', name: '榴莲壳', mark: '榴', bin: 'other', src: '/lesson03/waste-durian.jpg' },
];

const BINS: { id: BinId; name: string }[] = [
  { id: 'kitchen', name: '厨余垃圾' },
  { id: 'recycle', name: '可回收物' },
  { id: 'harm', name: '有害垃圾' },
  { id: 'other', name: '其他垃圾' },
];

const BROKEN = `item = "香蕉皮"
if item == "香蕉皮":
    print("厨余垃圾")
if item == "旧报纸":
    print("可回收物")
else:
    print("暂未收录")`;

const FIXED = `item = "香蕉皮"
if item == "香蕉皮":
    print("厨余垃圾")
elif item == "旧报纸":
    print("可回收物")
else:
    print("暂未收录")`;

interface BranchStep {
  label: string;
  result: '执行' | '跳过' | '不成立';
  detail: string;
}

function analyze(code: string, itemOverride?: string): { item: string; steps: BranchStep[]; prints: string[] } {
  const assigned = code.match(/item\s*=\s*(?:input\([^)]*\)|"([^"]*)")/);
  const item = itemOverride ?? assigned?.[1] ?? '（等待输入）';
  const lines = code.split('\n');
  const steps: BranchStep[] = [];
  const prints: string[] = [];
  let open = false;

  const takePrint = (body: string) => {
    const printed = body.match(/print\("([^"]*)"\)/);
    if (printed) prints.push(printed[1]);
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    const cond = line.match(/^(if|elif)\s+item\s*==\s*"([^"]*)"\s*:/);
    const isElse = /^else\s*:/.test(line);
    if (!cond && !isElse) continue;
    const body = lines[index + 1] ?? '';
    if (cond?.[1] === 'if') open = true;
    const label = isElse ? 'else' : `item == "${cond?.[2]}"`;
    if (!open) {
      steps.push({ label, result: '跳过', detail: '前面已经有分支执行，这一条不再判断' });
      continue;
    }
    const hit = isElse || item === cond?.[2];
    if (hit) {
      steps.push({
        label,
        result: '执行',
        detail: isElse ? '前面条件都不成立' : '条件为 True',
      });
      takePrint(body);
      open = false;
    } else {
      steps.push({ label, result: '不成立', detail: '条件为 False，继续看下一条' });
    }
  }

  return { item, steps, prints };
}

export interface ExecFrame {
  line: number;
  note: string;
  print?: string;
}

function compareNumber(left: number, op: string, right: number): boolean {
  if (op === '<=') return left <= right;
  if (op === '<') return left < right;
  if (op === '>=') return left >= right;
  if (op === '>') return left > right;
  return left === right;
}

function distanceFrames(code: string): ExecFrame[] {
  const lines = code.split('\n');
  const value = Number(code.match(/distance\s*=\s*([0-9.]+)/)?.[1] ?? '0');
  const frames: ExecFrame[] = [];
  let open = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    if (/^distance\s*=/.test(line)) {
      frames.push({ line: index + 1, note: `distance = ${value}` });
      continue;
    }
    const topPrint = line.match(/^print\("([^"]*)"\)/);
    if (topPrint) {
      frames.push({ line: index + 1, note: `输出「${topPrint[1]}」`, print: topPrint[1] });
      continue;
    }
    const cond = line.match(/^(if|elif)\s+distance\s*(<=|>=|<|>|==)\s*([0-9.]+)\s*:/);
    const isElse = /^else\s*:/.test(line);
    if (!cond && !isElse) continue;
    const printed = (lines[index + 1] ?? '').match(/print\("([^"]*)"\)/)?.[1];
    if (cond?.[1] === 'if') open = true;
    if (!open) {
      frames.push({ line: index + 1, note: '跳过' });
      continue;
    }
    const hit = isElse || compareNumber(value, cond?.[2] ?? '==', Number(cond?.[3] ?? '0'));
    if (hit) {
      frames.push({ line: index + 1, note: isElse ? '进入 else' : 'True' });
      if (printed) frames.push({ line: index + 2, note: `输出「${printed}」`, print: printed });
      open = false;
    } else {
      frames.push({ line: index + 1, note: 'False' });
    }
  }
  return frames;
}

/** 按源码顺序生成逐行执行帧，行号从 1 开始。 */
export function executionFrames(code: string): ExecFrame[] {
  if (/distance\s*=/.test(code)) return distanceFrames(code);
  const lines = code.split('\n');
  const assigned = code.match(/item\s*=\s*"([^"]*)"/);
  const item = assigned?.[1] ?? '';
  const frames: ExecFrame[] = [];
  let open = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    const assign = line.match(/^item\s*=\s*"([^"]*)"/);
    if (assign) {
      frames.push({ line: index + 1, note: `item = "${assign[1]}"` });
      continue;
    }
    const cond = line.match(/^(if|elif)\s+item\s*==\s*"([^"]*)"\s*:/);
    const isElse = /^else\s*:/.test(line);
    if (!cond && !isElse) continue;
    const body = lines[index + 1] ?? '';
    const printed = body.match(/print\("([^"]*)"\)/)?.[1];
    if (cond?.[1] === 'if') open = true;
    if (!open) {
      frames.push({ line: index + 1, note: '跳过' });
      continue;
    }
    const hit = isElse || item === cond?.[2];
    if (hit) {
      frames.push({ line: index + 1, note: isElse ? '进入 else' : 'True' });
      if (printed) {
        frames.push({ line: index + 2, note: `输出「${printed}」`, print: printed });
      }
      open = false;
    } else {
      frames.push({ line: index + 1, note: 'False' });
    }
  }

  return frames;
}

function Cover({ sceneId }: { sceneId: string }) {
  const { phase, advance } = useStageAdvance(sceneId, 1);
  const [picked, setPicked] = useState<ItemId | null>('banana');
  const [placed, setPlaced] = useState<Partial<Record<ItemId, BinId>>>({});

  if (phase === 0) {
    return (
      <button type="button" className="w-full text-left" onClick={advance}>
        <h2 className="title-stage mt-4 text-5xl leading-tight text-text-primary">
          多分支条件控制
        </h2>
        <p className="mt-10 text-lg text-text-secondary">点击进入：今天，你来当垃圾分类指导员</p>
      </button>
    );
  }

  const done = ITEMS.every((item) => placed[item.id] === item.bin);

  return (
    <div className="w-full">
      <h2 className="title-stage text-4xl text-text-primary">今天，你来当垃圾分类指导员</h2>
      <p className="mt-3 text-xl text-text-secondary">先点物品，再点垃圾桶。答案先不公布。</p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {ITEMS.map((item) => {
          const result = placed[item.id];
          const ok = result === item.bin;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPicked(item.id)}
              className={`rounded-3xl border px-4 py-6 text-center transition ${
                picked === item.id ? 'border-accent bg-accent-muted' : 'border-classroom-border bg-classroom-stage'
              }`}
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-code-bg text-2xl font-semibold text-accent mx-auto">
                {item.mark}
              </span>
              <p className="mt-3 text-2xl text-text-primary">{item.name}</p>
              {result && (
                <p className={`mt-2 text-sm font-semibold ${ok ? 'text-accent' : 'text-error'}`}>
                  {ok ? BINS.find((bin) => bin.id === result)?.name : '再想一想'}
                </p>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-6 grid grid-cols-4 gap-3">
        {BINS.map((bin) => (
          <button
            key={bin.id}
            type="button"
            onClick={() => {
              if (!picked) return;
              setPlaced((prev) => ({ ...prev, [picked]: bin.id }));
            }}
            className="rounded-2xl border border-classroom-border bg-classroom-stage px-3 py-4 text-lg text-text-primary hover:border-accent"
          >
            {bin.name}
          </button>
        ))}
      </div>
      {done && (
        <p className="mt-6 text-2xl text-text-primary">大家都能作出选择。能不能让 Python 也学会这样的判断？</p>
      )}
    </div>
  );
}

function Conflict() {
  const [choice, setChoice] = useState<string | null>(null);
  const options = [
    { id: 'a', label: 'A：厨余垃圾', correct: false },
    { id: 'b', label: 'B：厨余垃圾和暂未收录', correct: true },
    { id: 'c', label: 'C：程序报错', correct: false },
  ];
  const picked = options.find((option) => option.id === choice);

  return (
    <div className="w-full">
      <h2 className="title-stage text-3xl leading-tight text-text-primary">简单的垃圾分类程序</h2>
      <div className="mt-5">
        <p className="text-xl text-text-secondary">程序输出结果是？</p>
        <div className="mt-4 space-y-3">
          {options.map((option) => {
            const selected = choice === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setChoice(option.id)}
                className={`block w-full rounded-2xl border px-4 py-3 text-left text-lg ${
                  selected
                    ? option.correct
                      ? 'border-accent bg-accent-muted'
                      : 'border-error bg-error/10'
                    : 'border-classroom-border'
                }`}
              >
                {option.label}
                {selected && (
                  <span className={`ml-3 text-base font-semibold ${option.correct ? 'text-accent' : 'text-error'}`}>
                    {option.correct ? '正确' : '不正确'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {picked && (
          <p className={`mt-5 text-xl font-semibold ${picked.correct ? 'text-accent' : 'text-error'}`}>
            {picked.correct ? '选对了。输出是两行。' : '再看左侧代码。答案是 B。'}
          </p>
        )}
      </div>
    </div>
  );
}

interface TraceView {
  line?: number;
  note?: string;
  prints: string[];
}

let traceView: TraceView = { prints: [] };
const traceListeners = new Set<() => void>();

function emitTrace(next: TraceView) {
  traceView = next;
  traceListeners.forEach((listener) => listener());
}

export function useExecTrace(): TraceView {
  return useSyncExternalStore(
    (listener) => {
      traceListeners.add(listener);
      return () => traceListeners.delete(listener);
    },
    () => traceView,
    () => traceView,
  );
}

function TracePanel() {
  const { state } = useSceneEngine();
  const [runId, setRunId] = useState(0);
  const [phase, setPhase] = useState(0);
  const frames = executionFrames(state.sceneLocal.code);
  const started = runId > 0;
  const prints = started
    ? frames.slice(0, phase).flatMap((frame) => (frame.print ? [frame.print] : []))
    : [];

  useEffect(() => {
    if (!started) {
      emitTrace({ prints: [] });
      return;
    }
    const shown = frames.slice(0, phase).flatMap((frame) => (frame.print ? [frame.print] : []));
    const step = phase > 0 ? frames[phase - 1] : undefined;
    emitTrace({ line: step?.line, note: step?.note, prints: shown });
  }, [started, phase, state.sceneLocal.code, frames]);

  useEffect(() => () => emitTrace({ prints: [] }), []);

  useEffect(() => {
    if (!started || phase >= frames.length) return;
    const timer = window.setTimeout(() => setPhase((value) => value + 1), 900);
    return () => window.clearTimeout(timer);
  }, [started, phase, frames.length]);

  return (
    <div className="w-full">
      <h2 className="title-stage text-3xl leading-tight text-text-primary">程序到底是怎样执行的？</h2>
      <button
        type="button"
        className="mt-8 rounded-2xl bg-accent px-8 py-3 text-xl font-semibold text-white"
        onClick={() => {
          setPhase(0);
          setRunId((value) => value + 1);
        }}
      >
        运行
      </button>
      {started && (
        <pre className="mt-6 min-h-16 font-mono text-2xl leading-relaxed text-text-primary">
          {prints.join('\n')}
        </pre>
      )}
      {started && phase >= frames.length && frames.length > 0 && (
        <p className="mt-4 text-2xl font-semibold text-violet-600">两个独立 if ≠ 一个多分支选择结构</p>
      )}
    </div>
  );
}

const ELIF_SYNTAX = `if 条件1:
    语句块1
elif 条件2: # elif理解为“否则，如果”
    语句块2
elif 条件3:
    语句块3
elif 条件4:
    语句块4
elif 条件5:
    语句块5
else:
    默认语句块`;

function ElifFix({ sceneId }: { sceneId: string }) {
  const { dispatch } = useSceneEngine();
  const { phase, advance } = useStageAdvance(sceneId, 1);

  useEffect(() => {
    dispatch({
      type: 'UPDATE_CODE',
      code: phase >= 1 ? FIXED : BROKEN,
      clearOutput: true,
    });
  }, [dispatch, phase]);

  return (
    <div className="w-full">
      {phase === 0 && (
        <>
          <p className="text-2xl leading-relaxed text-text-primary">
            如果我们希望程序找到一个合适的分类后，就不再继续判断，应该怎么修改？
          </p>
          <button type="button" className="mt-8 text-lg font-semibold text-accent" onClick={advance}>
            下一步
          </button>
        </>
      )}
      {phase >= 1 && (
        <div>
          <p className="text-2xl font-semibold text-text-primary">多分支语法</p>
          <pre className="mt-4 whitespace-pre-wrap font-mono text-lg leading-8 text-text-primary">{ELIF_SYNTAX}</pre>
        </div>
      )}
    </div>
  );
}

function Lab() {
  const { dispatch } = useSceneEngine();
  const [item, setItem] = useState<ItemId>('banana');
  const [chain, setChain] = useState(false);
  const [phase, setPhase] = useState(0);
  const name = ITEMS.find((row) => row.id === item)!.name;
  const base = chain
    ? `item = "香蕉皮"
if item == "香蕉皮":
    print("厨余垃圾")
elif item == "易拉罐":
    print("可回收物")
elif item == "榴莲壳":
    print("其他垃圾")
else:
    print("暂未收录")`
    : `item = "香蕉皮"
if item == "香蕉皮":
    print("厨余垃圾")
if item == "易拉罐":
    print("可回收物")
if item == "榴莲壳":
    print("其他垃圾")`;
  const code = base.replace('item = "香蕉皮"', `item = "${name}"`);
  const frames = executionFrames(code);
  const result = analyze(code);

  useEffect(() => {
    dispatch({
      type: 'UPDATE_CODE',
      code,
      clearOutput: true,
    });
  }, [code, dispatch]);

  useEffect(() => {
    setPhase(0);
  }, [code]);

  useEffect(() => {
    if (phase >= frames.length) return;
    const timer = window.setTimeout(() => setPhase((value) => value + 1), 900);
    return () => window.clearTimeout(timer);
  }, [phase, frames.length, code]);

  useEffect(() => {
    const step = phase > 0 ? frames[phase - 1] : undefined;
    const prints = frames.slice(0, phase).flatMap((frame) => (frame.print ? [frame.print] : []));
    emitTrace({ line: step?.line, note: step?.note, prints });
  }, [phase, code, frames]);

  useEffect(() => () => emitTrace({ prints: [] }), []);

  let reached = -1;
  for (let index = 0; index < phase && index < frames.length; index += 1) {
    const note = frames[index]?.note ?? '';
    if (note === 'True' || note === 'False' || note === '进入 else' || note === '跳过') reached += 1;
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid grid-cols-3 gap-3">
        {ITEMS.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => setItem(row.id)}
            className={`overflow-hidden rounded-2xl bg-white ring-2 ${
              item === row.id ? 'ring-accent' : 'ring-transparent'
            }`}
          >
            <img src={row.src} alt={row.name} className="h-24 w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-classroom-playground p-1.5">
        <button
          type="button"
          onClick={() => setChain(false)}
          className={`rounded-xl px-3 py-3 text-lg font-semibold ${!chain ? 'bg-white text-text-primary shadow-card' : 'text-text-secondary'}`}
        >
          三个独立 if
        </button>
        <button
          type="button"
          onClick={() => setChain(true)}
          className={`rounded-xl px-3 py-3 text-lg font-semibold ${chain ? 'bg-white text-text-primary shadow-card' : 'text-text-secondary'}`}
        >
          if → elif → else
        </button>
      </div>

      <ol className="mt-6 space-y-2">
        {result.steps.map((step, index) => {
          const stateName = index < reached ? 'done' : index === reached ? 'now' : 'wait';
          return (
            <li
              key={step.label}
              className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 ${
                stateName === 'now'
                  ? 'bg-white shadow-card ring-2 ring-accent'
                  : stateName === 'done'
                    ? 'bg-white/70'
                    : 'opacity-40'
              }`}
            >
              <span className={`font-mono text-xl ${stateName === 'wait' ? 'text-text-secondary' : 'text-text-primary'}`}>
                {step.label}
              </span>
              <span
                className={`shrink-0 text-lg font-semibold ${
                  step.result === '执行' ? 'text-accent' : step.result === '跳过' ? 'text-text-secondary' : 'text-highlight'
                }`}
              >
                {stateName === 'wait' ? '' : step.result}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const DRONE_WRONG = `distance = 1
if distance <= 5:
    print("减速并监测")
elif distance <= 2:
    print("紧急停止")
else:
    print("继续前进")
print("本次避障决策完成，继续执行后续任务。")`;

function DroneScene() {
  const { state, dispatch } = useSceneEngine();
  const [intro, setIntro] = useState(true);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [showReason, setShowReason] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);
  const frames = executionFrames(DRONE_WRONG);
  const runCount = state.sceneLocal.runCount;

  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code: DRONE_WRONG, clearOutput: true });
  }, [dispatch]);

  useEffect(() => {
    if (runCount < 1) return;
    setPhase(0);
    setShowConclusion(false);
    setShowReason(false);
    setRunning(true);
  }, [runCount]);

  useEffect(() => {
    if (!running || phase >= frames.length) return;
    const timer = window.setTimeout(() => setPhase((value) => value + 1), 900);
    return () => window.clearTimeout(timer);
  }, [running, phase, frames.length]);

  useEffect(() => {
    if (!running) {
      emitTrace({ prints: [] });
      return;
    }
    const step = phase > 0 ? frames[phase - 1] : undefined;
    emitTrace({ line: step?.line, note: step?.note, prints: [] });
  }, [running, phase, frames]);

  useEffect(() => () => emitTrace({ prints: [] }), []);

  if (intro) {
    return (
      <div className="flex h-full min-h-0 flex-col justify-center gap-6">
        <p className="text-2xl leading-relaxed text-text-primary">刚才用 elif 解决了垃圾分类里重复判断的问题。</p>
        <p className="text-2xl font-semibold leading-relaxed text-text-primary">掌握了 elif，程序就一定能作出正确选择吗？</p>
        <p className="text-2xl leading-relaxed text-text-primary">接下来把同样的多分支用到要求更高的场景：无人机自主避障。</p>
        <button type="button" className="text-left text-lg font-semibold text-accent" onClick={() => setIntro(false)}>
          进入避障
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="relative h-48 overflow-hidden rounded-3xl bg-white">
        <svg viewBox="0 0 120 80" className="absolute bottom-4 left-6 h-28 w-28" aria-hidden>
          <ellipse cx="46" cy="72" rx="22" ry="4" fill="#e6e6e6" />
          <rect x="40" y="46" width="10" height="26" rx="3" fill="#8d5a32" />
          <circle cx="44" cy="38" r="22" fill="#3dae4a" />
          <circle cx="28" cy="30" r="14" fill="#67c56e" />
          <circle cx="58" cy="32" r="13" fill="#2f9e44" />
        </svg>
        <svg viewBox="0 0 180 80" className="drone-fly absolute bottom-10 right-4 h-24 w-44" aria-label="无人机朝树木飞行">
          <rect x="48" y="28" width="84" height="26" rx="10" fill="#d9dde3" />
          <rect x="66" y="34" width="48" height="12" rx="4" fill="#f7f8fa" />
          <rect x="18" y="34" width="34" height="6" rx="3" fill="#b7bec7" />
          <rect x="128" y="34" width="34" height="6" rx="3" fill="#b7bec7" />
          <circle cx="20" cy="37" r="8" fill="#9aa3ad" />
          <circle cx="160" cy="37" r="8" fill="#9aa3ad" />
          <path d="M90 54 a14 8 0 0 1 0 12" stroke="#5ec8e6" strokeWidth="3" fill="none" />
        </svg>
      </div>
      <div className="rounded-2xl bg-white px-4 py-3 text-lg leading-relaxed text-text-primary">
        <p className="font-semibold">避障规则</p>
        <p className="mt-1">小于 2 米紧急停止，小于 5 米减速，大于 5 米继续前进。</p>
      </div>
      <p className="text-2xl font-semibold leading-snug text-text-primary">距离只有 1 米，程序输出哪一种决策？</p>
      {runCount >= 1 && !showReason && (
        <button type="button" className="text-left text-lg font-semibold text-accent" onClick={() => setShowReason(true)}>
          揭示错误原因
        </button>
      )}
      {showReason && (
        <p className="text-lg leading-relaxed text-text-primary">
          错误原因：1 米同时满足两个条件。第一条已经成立，后面的 elif 被跳过，所以没有紧急停止。
        </p>
      )}
      {showReason && !showConclusion && (
        <button type="button" className="text-left text-lg font-semibold text-accent" onClick={() => setShowConclusion(true)}>
          揭示结论
        </button>
      )}
      {showConclusion && (
        <p className="text-xl font-semibold leading-relaxed text-accent">
          程序的判断不仅取决于<span className="text-error">条件是否正确</span>，还取决于条件的<span className="text-error">判断顺序是否合理</span>。更具体的条件优先判断，避免被宽泛条件提前覆盖。
        </p>
      )}
    </div>
  );
}

function Values() {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col">
      <p className="text-center text-3xl font-semibold text-text-primary">程序能运行，决策就一定正确吗？</p>
      <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-5">
        <div className="flex flex-col rounded-3xl border border-classroom-border bg-white px-4 py-4">
          <div className="grid min-h-0 flex-1 grid-rows-2 gap-2 overflow-hidden rounded-2xl bg-[#d7f3ea] p-3">
            <div className="grid grid-cols-4 gap-2">
              {[
                ['/lesson03/waste-banana.jpg', '香蕉皮'],
                ['/lesson03/waste-can.jpg', '易拉罐'],
                ['/lesson03/waste-durian.jpg', '榴莲壳'],
                ['/lesson03/waste-medicine.jpg', '过期药品'],
              ].map(([src, alt]) => (
                <img key={alt} src={src} alt={alt} className="h-full w-full rounded-xl object-cover" />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                ['/lesson03/bin-green.jpg', '厨余垃圾桶'],
                ['/lesson03/bin-blue.jpg', '可回收物垃圾桶'],
                ['/lesson03/bin-gray.jpg', '其他垃圾桶'],
                ['/lesson03/bin-red.jpg', '有害垃圾桶'],
              ].map(([src, alt]) => (
                <img key={alt} src={src} alt={alt} className="h-full w-full rounded-xl object-cover" />
              ))}
            </div>
          </div>
          <div className="px-2 py-4 text-center">
            <p className="text-2xl font-semibold text-text-primary">垃圾分类</p>
            <p className="mt-2 text-lg text-text-secondary">分类规则不合理</p>
            <p className="my-1 text-xl text-text-secondary" aria-hidden>↓</p>
            <p className="text-2xl font-semibold text-text-primary">可能导致错误投放</p>
          </div>
        </div>
        <div className="flex flex-col rounded-3xl border border-classroom-border bg-white px-4 py-4">
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#f4f7fb]">
            <img src="/lesson03/drone-avoid.svg" alt="无人机接近树木并规划避让路线" className="h-full w-full object-contain p-4" />
          </div>
          <div className="px-2 py-4 text-center">
            <p className="text-2xl font-semibold text-text-primary">无人机避障</p>
            <p className="mt-2 text-lg text-text-secondary">判断顺序不合理</p>
            <p className="my-1 text-xl text-text-secondary" aria-hidden>↓</p>
            <p className="text-2xl font-semibold text-text-primary">可能带来安全风险</p>
          </div>
        </div>
      </div>
      <p className="mt-2 border-t border-classroom-border py-4 text-center text-2xl font-semibold text-text-primary">
        代码有逻辑，技术有责任
      </p>
    </div>
  );
}

function SummaryIcon({ kind }: { kind: 'order' | 'choice' | 'next' }) {
  if (kind === 'order') {
    return (
      <svg viewBox="0 0 24 24" className="mx-auto h-8 w-8 text-text-secondary" aria-hidden>
        <path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'choice') {
    return (
      <svg viewBox="0 0 24 24" className="mx-auto h-8 w-8 text-text-secondary" aria-hidden>
        <path d="M12 4v6M12 10c-4 0-6 2-6 6M12 10c4 0 6 2 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="12" cy="4" r="1.4" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="mx-auto h-8 w-8 text-text-secondary" aria-hidden>
      <path d="M12 5v12M7 13l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Summary() {
  const keys: { kind: 'order' | 'choice' | 'next'; word: string; line: string }[] = [
    { kind: 'order', word: '有顺序', line: '从上到下' },
    { kind: 'choice', word: '有选择', line: '首个成立即执行' },
    { kind: 'next', word: '有后续', line: '分支结束继续向下' },
  ];
  return (
    <div className="flex h-full min-h-0 w-full flex-col justify-center">
      <p className="text-center text-3xl font-semibold text-text-primary">多分支判断：三个关键</p>
      <div className="mt-10 grid grid-cols-3 gap-4">
        {keys.map((key) => (
          <div key={key.word} className="text-center">
            <SummaryIcon kind={key.kind} />
            <p className="mt-3 text-2xl font-semibold text-text-primary">{key.word}</p>
            <p className="mt-2 text-lg text-text-secondary">{key.line}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 text-center text-2xl text-text-primary">条件有包含，顺序很关键；分支执行完，程序继续走。</p>
    </div>
  );
}

function ThanksSketch() {
  return (
    <div className="flex w-28 flex-col items-center justify-between py-1 text-[#1B3A6B]" aria-hidden>
      <svg viewBox="0 0 80 96" className="h-24 w-20">
        <path
          d="M48 14c10 0 16 7 16 16 0 8-6 12-14 14-10 2-16 8-16 16s7 14 16 14c8 0 12-3 16-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="46" cy="24" r="1.6" fill="currentColor" />
        <path d="M58 18c3 1 4 2 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M22 78c6 6 14 8 22 4" fill="none" stroke="#0A5C4F" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 80 88" className="h-24 w-20">
        <path d="M40 8v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M40 26C22 40 16 52 16 70" fill="none" stroke="#0A5C4F" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M40 26v44" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 4" />
        <path d="M40 26C58 40 64 52 64 70" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 4" />
        <text x="8" y="84" fill="#0A5C4F" fontSize="9" fontFamily="ui-monospace, monospace">
          if
        </text>
        <text x="32" y="84" fill="currentColor" fontSize="9" fontFamily="ui-monospace, monospace">
          elif
        </text>
      </svg>
      <p className="font-mono text-lg tracking-wide text-[#1B3A6B]/80">&gt;&gt;&gt;</p>
    </div>
  );
}

function Thanks() {
  return (
    <div className="flex h-full min-h-0 w-full items-center justify-center">
      <div className="relative px-14 py-12">
        <div className="pointer-events-none absolute inset-0 border border-accent/35" />
        <div className="pointer-events-none absolute inset-2 border border-accent/15" />
        <div className="flex items-stretch gap-10">
          <ThanksSketch />
          <h2
            className="font-display text-6xl leading-none tracking-[0.55em] text-[#1B3A6B]"
            style={{ writingMode: 'vertical-rl' }}
          >
            谢谢大家
          </h2>
          <div className="flex w-72 flex-col justify-between py-1">
            <p className="font-display text-lg tracking-[0.42em] text-accent">多分支条件控制</p>
            <div className="font-display text-2xl leading-[2.4] text-text-secondary">
              <p>从上到下</p>
              <p>只走一条路</p>
              <p className="mt-4">愿每一次判断</p>
              <p>都担得起它的结果</p>
            </div>
            <span className="grid h-16 w-16 place-items-center self-end rounded-full border-2 border-accent/70 font-display text-2xl text-accent">
              谢
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Homework() {
  return (
    <div className="w-full rounded-3xl border border-classroom-border bg-white px-8 py-7">
      <p className="text-2xl font-semibold text-text-primary">&lt;/&gt; 基础任务：垃圾分类助手 2.0</p>
      <p className="mt-4 text-xl leading-relaxed text-text-primary">
        在课堂代码的基础上，增加两种物品及其分类规则，并考虑未收录物品。
      </p>
      <p className="mt-3 text-xl leading-relaxed text-text-primary">
        要求至少测试四组输入，说明每组输入为什么进入对应分支。
      </p>
      <div className="my-6 border-t border-classroom-border" />
      <p className="text-2xl font-semibold text-text-primary">进阶任务：无人机电量决策系统</p>
      <p className="mt-4 text-xl text-text-primary">设计多分支程序：</p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-xl leading-relaxed text-text-primary">
        <li>电量 ≤15%：紧急低电量提醒。</li>
        <li>15% &lt; 电量 ≤30%：节能提醒。</li>
        <li>电量 &gt;30%：正常任务提醒。</li>
      </ul>
      <p className="mt-4 text-xl leading-relaxed text-text-primary">
        要求测试 15%、16%、30%、31%，并解释判断顺序。
      </p>
    </div>
  );
}

export function BranchContestStage({ content, sceneId }: Props) {
  switch (content.mode) {
    case 'cover':
      return <Cover sceneId={sceneId} />;
    case 'conflict':
      return <Conflict />;
    case 'trace':
      return <TracePanel />;
    case 'elif':
      return <ElifFix sceneId={sceneId} />;
    case 'lab':
      return <Lab />;
    case 'extend':
      return <DroneScene />;
    case 'values':
      return <Values />;
    case 'summary':
      return <Summary />;
    case 'homework':
      return <Homework />;
    case 'thanks':
      return <Thanks />;
  }
}
