import { useEffect, useMemo, useState } from 'react';
import type { HanoiTraceContent } from '../../types/scene';
import { setStepCursor } from './StepRunStage';

type Rod = 'A' | 'B' | 'C';

interface HanoiStep {
  move?: { disk: number; from: Rod; to: Rod };
  rods: Record<Rod, number[]>;
  stack: string[];
  line: number;
  lineText: string;
}

const STEPS: HanoiStep[] = [
  {
    rods: { A: [3, 2, 1], B: [], C: [] },
    stack: ['hanoi(3, A, B, C)'],
    line: 14,
    lineText: 'hanoi(3, "A", "B", "C")',
  },
  {
    move: { disk: 1, from: 'A', to: 'C' },
    rods: { A: [3, 2], B: [], C: [1] },
    stack: ['hanoi(3, A, B, C)', 'hanoi(2, A, C, B)', 'hanoi(1, A, B, C)'],
    line: 4,
    lineText: 'print(source, "->", target)',
  },
  {
    move: { disk: 2, from: 'A', to: 'B' },
    rods: { A: [3], B: [2], C: [1] },
    stack: ['hanoi(3, A, B, C)', 'hanoi(2, A, C, B)'],
    line: 10,
    lineText: 'print(source, "->", target)',
  },
  {
    move: { disk: 1, from: 'C', to: 'B' },
    rods: { A: [3], B: [2, 1], C: [] },
    stack: ['hanoi(3, A, B, C)', 'hanoi(2, A, C, B)', 'hanoi(1, C, A, B)'],
    line: 4,
    lineText: 'print(source, "->", target)',
  },
  {
    move: { disk: 3, from: 'A', to: 'C' },
    rods: { A: [], B: [2, 1], C: [3] },
    stack: ['hanoi(3, A, B, C)'],
    line: 10,
    lineText: 'print(source, "->", target)',
  },
  {
    move: { disk: 1, from: 'B', to: 'A' },
    rods: { A: [1], B: [2], C: [3] },
    stack: ['hanoi(3, A, B, C)', 'hanoi(2, B, A, C)', 'hanoi(1, B, C, A)'],
    line: 4,
    lineText: 'print(source, "->", target)',
  },
  {
    move: { disk: 2, from: 'B', to: 'C' },
    rods: { A: [1], B: [], C: [3, 2] },
    stack: ['hanoi(3, A, B, C)', 'hanoi(2, B, A, C)'],
    line: 10,
    lineText: 'print(source, "->", target)',
  },
  {
    move: { disk: 1, from: 'A', to: 'C' },
    rods: { A: [], B: [], C: [3, 2, 1] },
    stack: ['hanoi(3, A, B, C)', 'hanoi(2, B, A, C)', 'hanoi(1, A, B, C)'],
    line: 4,
    lineText: 'print(source, "->", target)',
  },
];

const ROD_LEFT: Record<Rod, string> = { A: '16.667%', B: '50%', C: '83.333%' };
const DISK_STYLE: Record<number, { width: string; color: string }> = {
  1: { width: '22%', color: '#2E8B57' },
  2: { width: '30%', color: '#D9822B' },
  3: { width: '38%', color: '#1B3A6B' },
};

function locate(rods: Record<Rod, number[]>, disk: number) {
  for (const rod of ['A', 'B', 'C'] as Rod[]) {
    const level = rods[rod].indexOf(disk);
    if (level >= 0) return { rod, level };
  }
  return { rod: 'A' as Rod, level: 0 };
}

export function HanoiTraceStage({
  sceneId,
  config,
}: {
  sceneId: string;
  config: HanoiTraceContent;
}) {
  const steps = useMemo(() => STEPS.slice(0, 2 ** config.disks), [config.disks]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[index]!;

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [sceneId]);

  useEffect(() => {
    setStepCursor(sceneId, step.line);
    return () => setStepCursor(sceneId, null);
  }, [sceneId, step.line]);

  useEffect(() => {
    if (!playing) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setIndex((value) => value + 1), 1400);
    return () => window.clearTimeout(timer);
  }, [index, playing, steps.length]);

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between rounded-xl border border-classroom-border bg-classroom-stage px-3 py-1.5 shadow-card">
        <div>
          <p className="text-sm text-text-secondary">当前代码行 · 第 {step.line} 行</p>
          <code className="font-mono text-xs font-semibold text-text-primary">{step.lineText}</code>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm text-text-secondary">{index} / 7</p>
          <p className="text-base font-bold text-accent">
            {step.move ? `${step.move.from} → ${step.move.to}` : '准备开始'}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-classroom-border bg-classroom-stage p-1.5 shadow-card">
        <div className="mb-1 flex items-center justify-between px-1">
          <h3 className="text-base font-semibold text-text-primary">圆盘动态过程</h3>
          <span className="text-xs text-text-secondary">最少移动 2³ - 1 = 7 次</span>
        </div>
        <div className="relative h-[9rem] overflow-hidden rounded-xl bg-classroom-playground">
          <div className="absolute bottom-6 left-[5%] h-3 w-[90%] rounded-full bg-text-secondary/60" />
          {(['A', 'B', 'C'] as Rod[]).map((rod) => (
            <div key={rod}>
              <div
                className="absolute bottom-7 h-[6rem] w-2 -translate-x-1/2 rounded-t-full bg-text-secondary/60"
                style={{ left: ROD_LEFT[rod] }}
              />
              <span
                className="absolute bottom-0 -translate-x-1/2 font-mono text-lg font-bold text-text-primary"
                style={{ left: ROD_LEFT[rod] }}
              >
                {rod}
              </span>
            </div>
          ))}
          {[3, 2, 1].map((disk) => {
            const position = locate(step.rods, disk);
            const style = DISK_STYLE[disk]!;
            return (
              <div
                key={disk}
                className={`absolute z-10 flex h-6 -translate-x-1/2 items-center justify-center rounded-full font-mono text-xs font-bold text-white shadow-md transition-[left,bottom] duration-700 ease-in-out ${
                  step.move?.disk === disk ? 'ring-4 ring-highlight/40' : ''
                }`}
                style={{
                  left: ROD_LEFT[position.rod],
                  bottom: `${36 + position.level * 26}px`,
                  width: style.width,
                  backgroundColor: style.color,
                }}
              >
                {disk}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-classroom-border bg-classroom-stage p-1.5 shadow-card">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">同步调用栈</h3>
          <span className="text-xs text-text-secondary">深度 {step.stack.length}</span>
        </div>
        <div className="grid min-h-[4.5rem] grid-cols-3 items-end gap-1.5 rounded-xl bg-classroom-playground p-1.5">
          {step.stack.map((frame, frameIndex) => {
            const active = frameIndex === step.stack.length - 1;
            return (
              <div
                key={`${index}-${frame}`}
                className={`min-w-0 rounded-lg border-2 px-2 py-2 text-center font-mono text-[11px] font-semibold leading-tight ${
                  active
                    ? 'border-accent bg-accent-muted text-text-primary ring-2 ring-accent/30'
                    : 'border-classroom-border bg-classroom-stage text-text-secondary'
                }`}
              >
                {frame}
              </div>
            );
          })}
        </div>
        <p className="mt-1 text-center text-xs text-text-secondary">左侧是外层调用，右侧高亮的是当前栈顶</p>
      </section>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg border border-classroom-border px-2.5 py-1.5 text-sm disabled:opacity-40"
          disabled={index === 0}
          onClick={() => {
            setPlaying(false);
            setIndex((value) => Math.max(0, value - 1));
          }}
        >
          上一步
        </button>
        <button
          type="button"
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
          disabled={index >= steps.length - 1}
          onClick={() => {
            setPlaying(false);
            setIndex((value) => Math.min(steps.length - 1, value + 1));
          }}
        >
          下一步
        </button>
        <button
          type="button"
          className="rounded-lg border border-accent px-2.5 py-1.5 text-sm text-accent"
          onClick={() => {
            if (index >= steps.length - 1) setIndex(0);
            setPlaying((value) => !value);
          }}
        >
          {playing ? '暂停' : '自动播放'}
        </button>
        <button
          type="button"
          className="ml-auto rounded-lg px-2 py-1.5 text-sm text-text-secondary"
          onClick={() => {
            setPlaying(false);
            setIndex(0);
          }}
        >
          重置
        </button>
      </div>
    </div>
  );
}
