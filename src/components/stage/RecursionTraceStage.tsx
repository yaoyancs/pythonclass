import { useEffect, useMemo, useState } from 'react';
import type { RecursionTraceContent } from '../../types/scene';
import { setStepCursor } from './StepRunStage';

interface StackFrame {
  n: number;
  status: 'active' | 'waiting' | 'returning';
  waiting?: string;
}

interface RecursionStep {
  line: number;
  lineText: string;
  action: string;
  frames: StackFrame[];
  returnValue?: number;
  output?: string;
}

function buildFactSteps(argument: number): RecursionStep[] {
  const steps: RecursionStep[] = [
    {
      line: 6,
      lineText: `print(fact(${argument}))`,
      action: `准备调用 fact(${argument})`,
      frames: [],
    },
  ];

  function visit(n: number, waitingFrames: StackFrame[]): number {
    const active: StackFrame = { n, status: 'active' };
    steps.push({
      line: 2,
      lineText: 'if n == 0:',
      action: `进入 fact(${n})，检查基线条件：${n} == 0 为 ${n === 0 ? 'True' : 'False'}`,
      frames: [...waitingFrames, active],
    });

    if (n === 0) {
      steps.push({
        line: 3,
        lineText: 'return 1',
        action: '到达基线条件，不再递归；当前栈帧准备弹出',
        frames: [...waitingFrames, { n, status: 'returning' }],
        returnValue: 1,
      });
      return 1;
    }

    const waiting: StackFrame = {
      n,
      status: 'waiting',
      waiting: `${n} × fact(${n - 1})`,
    };
    steps.push({
      line: 4,
      lineText: 'return n * fact(n-1)',
      action: `fact(${n}) 暂停，保存 ${n} × □，调用 fact(${n - 1})`,
      frames: [...waitingFrames, waiting],
    });

    const child = visit(n - 1, [...waitingFrames, waiting]);
    const value = n * child;
    steps.push({
      line: 4,
      lineText: 'return n * fact(n-1)',
      action: `fact(${n}) 收到返回值 ${child}，计算 ${n} × ${child} = ${value}`,
      frames: [...waitingFrames, { n, status: 'returning', waiting: `${n} × ${child}` }],
      returnValue: value,
    });
    return value;
  }

  const result = visit(argument, []);
  steps.push({
    line: 6,
    lineText: `print(fact(${argument}))`,
    action: `最外层调用得到 ${result}，交给 print 输出；调用栈清空`,
    frames: [],
    returnValue: result,
    output: String(result),
  });
  return steps;
}

export function RecursionTraceStage({
  sceneId,
  config,
}: {
  sceneId: string;
  config: RecursionTraceContent;
}) {
  const steps = useMemo(() => buildFactSteps(config.argument), [config.argument]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[index]!;

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [sceneId, config.argument]);

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
    const timer = window.setTimeout(() => setIndex((value) => value + 1), 1250);
    return () => window.clearTimeout(timer);
  }, [index, playing, steps.length]);

  const activeDepth = step.frames.length;

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div className="rounded-2xl border border-classroom-border bg-classroom-stage px-3 py-2 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-text-secondary">当前代码行</p>
          <p className="font-mono text-sm text-text-secondary">
            {index + 1} / {steps.length}
          </p>
        </div>
        <div className="mt-1.5 flex items-center gap-3 rounded-xl border-2 border-accent bg-accent-muted px-3 py-1.5">
          <span className="rounded-md bg-accent px-2 py-1 font-mono text-sm font-bold text-white">
            {step.line}
          </span>
          <code className="font-mono text-base font-semibold text-text-primary">{step.lineText}</code>
        </div>
        <p className="mt-1.5 text-sm font-medium leading-snug text-text-primary">{step.action}</p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_0.85fr] gap-3">
        <section className="min-h-0 rounded-2xl border border-classroom-border bg-classroom-stage p-2.5 shadow-card">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold text-text-primary">调用栈</h3>
            <span className="text-sm text-text-secondary">深度 {activeDepth}</span>
          </div>
          <div className="flex min-h-[8rem] flex-col-reverse justify-start gap-1.5 rounded-xl bg-classroom-playground p-2">
            {step.frames.length === 0 ? (
              <p className="m-auto text-center text-base text-text-secondary">调用栈为空</p>
            ) : (
              step.frames.map((frame, frameIndex) => {
                const top = frameIndex === step.frames.length - 1;
                return (
                  <div
                    key={`${index}-${frameIndex}-${frame.n}`}
                    className={`rounded-xl border-2 px-3 py-1.5 transition-all ${
                      frame.status === 'waiting'
                        ? 'border-classroom-border bg-classroom-stage text-text-secondary'
                        : frame.status === 'returning'
                          ? 'border-highlight bg-highlight-muted text-text-primary'
                          : 'border-accent bg-accent-muted text-text-primary'
                    } ${top ? 'ring-2 ring-accent/30' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <code className="font-mono text-base font-bold">fact(n={frame.n})</code>
                      <span className="shrink-0 whitespace-nowrap text-xs font-semibold">
                        {frame.status === 'waiting'
                          ? '暂停等待'
                          : frame.status === 'returning'
                            ? '正在返回'
                            : '正在执行'}
                      </span>
                    </div>
                    {frame.waiting && (
                      <p className="mt-1 font-mono text-sm">保存：{frame.waiting}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <p className="mt-1.5 text-center text-xs text-text-secondary">栈顶在上方；新调用压栈，返回时弹栈</p>
        </section>

        <section className="flex flex-col gap-3">
          <div className="rounded-2xl border border-classroom-border bg-classroom-stage p-2.5 shadow-card">
            <h3 className="text-base font-semibold text-text-primary">返回值</h3>
            <div
              className={`mt-1.5 rounded-xl px-3 py-3 text-center font-mono text-2xl font-bold ${
                step.returnValue == null
                  ? 'bg-classroom-playground text-text-secondary'
                  : 'bg-highlight-muted text-highlight'
              }`}
            >
              {step.returnValue == null ? '等待中' : step.returnValue}
            </div>
          </div>
          <div className="rounded-2xl border border-classroom-border bg-classroom-stage p-2.5 shadow-card">
            <h3 className="text-base font-semibold text-text-primary">标准输出</h3>
            <pre className="mt-1.5 min-h-10 rounded-xl bg-code-bg px-3 py-2 font-mono text-base text-code-text">
              {step.output ?? ''}
            </pre>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
          重新开始
        </button>
      </div>
    </div>
  );
}
