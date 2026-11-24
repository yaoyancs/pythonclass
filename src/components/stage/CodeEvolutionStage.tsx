import { useCallback, useEffect, useRef, useState } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { publishBeatPhase } from '../../hooks/useStageAdvance';
import { CodeEditor } from '../playground/CodeEditor';
import { usePythonEngine } from '../../python/usePythonEngine';
import type { CodeEvolutionStep } from '../../types/scene';

/**
 * Embedded inside the existing classroom/scene engine, NOT a separate player.
 * Step-controlled Monaco edits: shortest deletion/insertion preserving common suffix.
 */
function editFrames(before: string, after: string): string[] {
  if (before === after) return [after];
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start++;
  let suffix = 0;
  while (suffix < before.length - start && suffix < after.length - start &&
    before[before.length - 1 - suffix] === after[after.length - 1 - suffix]) suffix++;
  const tail = suffix ? before.slice(before.length - suffix) : '';
  const frames: string[] = [];
  for (let i = before.length - suffix; i >= start; i--) {
    frames.push(before.slice(0, i) + tail);
  }
  const changed = after.slice(start, after.length - suffix);
  for (let i = 1; i <= changed.length; i++) {
    frames.push(before.slice(0, start) + changed.slice(0, i) + tail);
  }
  return frames.length ? frames : [after];
}

function changedLine(before: string, after: string): number {
  const a = before.split('\n');
  const b = after.split('\n');
  const first = b.findIndex((line, i) => line !== a[i]);
  return Math.max(1, first === -1 ? b.length : first + 1);
}

export function CodeEvolutionStage() {
  const { scene, state, dispatch } = useSceneEngine();
  const steps = scene.content.codeEvolution?.steps ?? [];
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [auto, setAuto] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [output, setOutput] = useState<{ text: string; error?: boolean; preview?: boolean } | null>(null);
  const [ran, setRan] = useState(false);
  const { isReady, runCode, statusMessage } = usePythonEngine();
  const oldCode = useRef('');
  const step = steps[index];
  const current = useRef({ index, auto, animating, ran });
  current.current = { index, auto, animating, ran };

  const go = useCallback((delta: number) => {
    const next = Math.max(0, Math.min(steps.length - 1, current.current.index + delta));
    if (next === current.current.index) return false;
    setAuto(false);
    setIndex(next);
    return true;
  }, [steps.length]);

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  useEffect(() => {
    setIndex(0);
    setAuto(false);
    oldCode.current = '';
    dispatch({ type: 'UPDATE_CODE', code: '', clearOutput: true });
  }, [scene.id, dispatch]);

  useEffect(() => {
    if (!step) return;
    const previous = oldCode.current;
    const target = step.code;
    oldCode.current = target;
    setOutput(null);
    setRan(false);
    publishBeatPhase(index);

    const frames = editFrames(previous, target);
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cursor = 0;
    setAnimating(true);
    const tick = () => {
      if (cancelled) return;
      const frame = frames[Math.min(cursor, frames.length - 1)] ?? target;
      dispatch({ type: 'UPDATE_CODE', code: frame, clearOutput: true });
      cursor += 1;
      if (cursor < frames.length) timer = setTimeout(tick, step.charDelayMs ?? 24);
      else {
        setAnimating(false);
        dispatch({ type: 'UPDATE_CODE', code: target, clearOutput: true });
      }
    };
    timer = setTimeout(tick, 40);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [index, scene.id, dispatch, step]);

  const execute = useCallback(async () => {
    if (!step || !isReady || current.current.animating || current.current.ran) return;
    setRan(true);
    setOutput({ text: '正在执行…' });
    try {
      const result = await runCode(step.code, async () => '小明');
      const errorText = result.error ? result.error.type + ': ' + result.error.message : result.stderr;
      setOutput({ text: [result.stdout, errorText].filter(Boolean).join('\n') || '（没有输出）', error: Boolean(result.error || result.stderr) });
    } catch (err) {
      setOutput({ text: String(err), error: true });
    }
  }, [step, isReady, runCode]);

  useEffect(() => {
    if (!step || animating || ran) return;
    if (step.mode === 'run' && isReady) void execute();
  }, [step, animating, ran, execute, isReady]);

  useEffect(() => {
    if (!step || !auto || animating) return;
    if (step.pauseForQuestion) {
      setAuto(false);
      return;
    }
    if (step.mode === 'run' && !ran) return;
    if (step.mode === 'run' && output?.text === '正在执行…') return;
    const timer = setTimeout(() => {
      if (!next()) setAuto(false);
      else setAuto(true);
    }, step.holdMs ?? 2300);
    return () => clearTimeout(timer);
  }, [step, auto, animating, ran, output, next]);

  useEffect(() => {
    window.__pyclassStageAdvance = next;
    window.__pyclassStageRetreat = prev;
    window.__pyclassRun = () => { void execute(); };
    return () => {
      delete window.__pyclassStageAdvance;
      delete window.__pyclassStageRetreat;
      delete window.__pyclassRun;
      publishBeatPhase(0);
    };
  }, [next, prev, execute]);

  if (!step) return null;
  const before = index > 0 ? steps[index - 1].code : '';
  const highlighted = step.highlightLine ?? changedLine(before, step.code);
  return (
    <section className="h-full min-h-0 flex flex-col gap-3 p-4 overflow-hidden bg-classroom-bg">
      <div className="flex items-start justify-between gap-5 rounded-xl border border-classroom-border bg-classroom-stage px-5 py-3">
        <div className="min-w-0">
          <div className="text-sm text-accent tracking-widest">{scene.title} · {index + 1} / {steps.length} · {step.phaseLabel}</div>
          <h2 className="text-2xl font-semibold text-text-primary mt-1">{step.prompt}</h2>
        </div>
        <div className="shrink-0 flex gap-2">
          <button type="button" className="rounded-lg border border-classroom-border px-3 py-2 text-text-primary" onClick={() => setShowNotes(x => !x)}>{showNotes ? '收起讲稿' : '详细讲稿'}</button>
        </div>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(250px,35%)] gap-3">
        <div className="min-h-0 flex flex-col rounded-2xl bg-classroom-stage p-3 overflow-hidden">
          <div className="text-sm text-text-secondary pb-2">main.py {animating ? ' · 正在演示代码修改…' : ' · 可以运行或继续'}</div>
          <CodeEditor fill fontSize={26} activeLine={highlighted} readOnly />
        </div>
        <div className="min-h-0 flex flex-col gap-3">
          <div className="min-h-0 flex-[1.1] rounded-2xl bg-classroom-stage border border-classroom-border p-4 overflow-auto">
            <h3 className="text-accent text-sm tracking-widest mb-2">本步讲解</h3>
            <p className="text-xl leading-relaxed text-text-primary">{step.talk}</p>
            {step.question && (
              <div className="mt-5 rounded-xl border-l-4 border-amber-400 bg-amber-400/10 p-3">
                <div className="text-xs text-amber-500 mb-1">停顿 · 请学生预测</div>
                <p className="text-lg text-text-primary">{step.question}</p>
              </div>
            )}
            {showNotes && <p className="mt-4 text-base leading-relaxed text-text-secondary whitespace-pre-line">{step.teacherNotes ?? step.talk}</p>}
          </div>
          <div className="min-h-0 flex-1 rounded-2xl bg-code-bg p-4 overflow-auto">
            <div className="flex justify-between gap-2 items-center mb-3">
              <h3 className="text-sm tracking-widest text-emerald-300">Python 运行结果</h3>
              <button type="button" disabled={animating || !isReady} onClick={() => { setRan(false); setOutput(null); void runCode(step.code, async () => '小明').then(r => { setRan(true); setOutput({ text: [r.stdout, r.error ? r.error.message : r.stderr].filter(Boolean).join('\n') || '（没有输出）', error: Boolean(r.error || r.stderr) }); }).catch(e=>setOutput({text:String(e),error:true})); }} className="rounded-lg bg-emerald-600 px-3 py-1 text-white disabled:opacity-40">运行</button>
            </div>
            <pre className={`text-xl font-mono whitespace-pre-wrap ${output?.error ? 'text-red-400' : 'text-emerald-100'}`}>{output?.text ?? (isReady ? '等待运行…' : `加载 Python 环境… ${statusMessage}`)}</pre>
            {!output && step.expectedOutput && <p className="text-sm text-text-secondary mt-3">运行后可验证本步预期结果</p>}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 rounded-xl border border-classroom-border bg-classroom-stage px-4 py-2">
        <button type="button" onClick={() => go(-1)} disabled={index === 0} className="px-4 py-2 rounded-lg border border-classroom-border text-text-primary disabled:opacity-30">← 上一步</button>
        <button type="button" onClick={() => { setAuto(x => !x); }} className={`px-4 py-2 rounded-lg text-white ${auto ? 'bg-amber-600' : 'bg-slate-600'}`}>{auto ? 'Ⅱ 暂停自动播放' : '▶ 自动播放'}</button>
        <button type="button" onClick={() => { setIndex(i => i); oldCode.current = ''; dispatch({ type: 'UPDATE_CODE', code: '', clearOutput: true }); setIndex(i => i === 0 ? 0 : i - 1); }} className="px-3 py-2 rounded-lg border border-classroom-border text-text-primary">重演上步</button>
        <div className="text-sm text-text-secondary ml-auto">{step.pauseForQuestion ? '课堂提问 · 等待手动继续' : '讲解步骤'}</div>
        <button type="button" onClick={next} disabled={index >= steps.length - 1} className="px-5 py-2 rounded-lg bg-accent text-white disabled:opacity-30">下一步 →</button>
      </div>
    </section>
  );
}
