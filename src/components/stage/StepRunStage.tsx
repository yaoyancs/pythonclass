import { useEffect, useState } from 'react';
import type { TraceStep, TraceVar } from '../../types/python';
import { pyodideClient } from '../../python/pyodideClient';

let cursor = { sceneId: '', line: null as number | null };
const listeners = new Set<() => void>();

function setStepCursor(sceneId: string, line: number | null) {
  cursor = { sceneId, line };
  listeners.forEach((listener) => listener());
}

export function useStepCursor(sceneId: string): number | undefined {
  const [, redraw] = useState(0);
  useEffect(() => {
    const listener = () => redraw((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  if (cursor.sceneId !== sceneId || cursor.line == null) return undefined;
  return cursor.line;
}

/** 空行和注释没有新的存储变化，逐步时跳过。 */
function visibleSteps(steps: TraceStep[], code: string): TraceStep[] {
  const lines = code.split('\n');
  return steps.filter((step, index) => {
    if (step.done || index === steps.length - 1) return true;
    if (step.line == null) return false;
    const text = (lines[step.line - 1] ?? '').trim();
    return text.length > 0 && !text.startsWith('#');
  });
}

function sourcesIn(code: string, name: string): string[] {
  const matched = code.match(new RegExp(`${name}\\s*=\\s*\\{([^}]+)\\}`));
  if (!matched) return [];
  return [...matched[1].matchAll(/["']([^"']+)["']/g)].map((part) => part[1]);
}

function hitOn(names: string[], line: string, pattern: (name: string) => RegExp): string | null {
  for (const name of names) {
    const matched = line.match(pattern(name));
    if (matched?.[1] != null) return matched[1];
  }
  return null;
}

function ObjectView({ item, names, line, code }: { item: TraceVar; names: string[]; line: string; code: string }) {
  const indexRaw = hitOn(names, line, (name) => new RegExp(`${name}\\[(\\d+)\\]`));
  const focusIndex = indexRaw == null ? null : Number(indexRaw);
  const focusKey = hitOn(names, line, (name) => new RegExp(`${name}\\[["']([^"']+)["']\\]`));

  if (item.kind === 'list' || item.kind === 'tuple') {
    const locked = item.kind === 'tuple';
    return (
      <div className="flex gap-2">
        {(item.items ?? []).map((el, i) => (
          <div key={`${item.name}-${i}`} className="flex w-16 flex-col items-center">
            <div className={`mb-1 h-10 text-center font-mono text-lg text-accent ${focusIndex === i ? '' : 'invisible'}`}>
              [{i}]
              <div>↓</div>
            </div>
            <div
              className={`w-full px-1 py-2 text-center ${
                locked
                  ? 'border-2 border-double border-text-primary bg-classroom-stage'
                  : 'rounded-lg border-2 border-highlight/50 bg-classroom-stage'
              } ${focusIndex === i ? 'ring-2 ring-accent' : ''}`}
            >
              <p className="text-sm text-highlight">{i}</p>
              <p className="font-mono text-lg text-text-primary">{el}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (item.kind === 'dict') {
    return (
      <div className="flex flex-col gap-3">
        {(item.pairs ?? []).map((pair) =>
          pair.items ? (
            <div key={pair.k} className="flex min-w-0 flex-col gap-2">
              <span className={`whitespace-nowrap font-mono text-xl ${focusKey === pair.k ? 'text-accent' : 'text-text-primary'}`}>
                {pair.k} →
              </span>
              <div className="flex flex-wrap gap-2">
                {pair.items.map((el, i) => (
                  <div
                    key={`${pair.k}-${i}`}
                    className={`min-w-[4.5rem] rounded-xl border-2 px-3 py-2 text-center ${focusKey === pair.k ? 'border-accent bg-accent-muted ring-2 ring-accent' : 'border-highlight/50 bg-classroom-stage'}`}
                  >
                    <p className="text-sm text-highlight">{i}</p>
                    <p className="whitespace-nowrap font-mono text-xl text-text-primary">{el}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              key={pair.k}
              className={`min-w-[7.5rem] rounded-2xl border-2 border-dashed px-4 py-2.5 text-center ${focusKey === pair.k ? 'border-accent bg-accent-muted ring-2 ring-accent' : 'border-accent/50 bg-classroom-stage'}`}
            >
              <p className="whitespace-nowrap font-mono text-xl text-text-primary">{pair.k}</p>
              <p className="whitespace-nowrap font-mono text-2xl text-text-primary">{pair.v}</p>
            </div>
          ),
        )}
      </div>
    );
  }

  const sources = names.flatMap((name) => sourcesIn(code, name));
  const slots = item.items ?? [];
  return (
    <div className="flex gap-3">
      {slots.map((el) => (
        <div key={el} className="flex min-w-[5.5rem] flex-col items-center">
          {sources.filter((src) => src === el).map((src, i) => (
            <div key={`${el}-${i}`} className="text-center font-mono text-lg text-accent">
              {src}
              <div>↓</div>
            </div>
          ))}
          <div className="w-full whitespace-nowrap rounded-2xl border-2 border-dashed border-accent bg-accent-muted px-4 py-3 text-center font-mono text-xl text-text-primary">
            {el}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StepRunStage({ sceneId, code }: { sceneId: string; code: string }) {
  const [steps, setSteps] = useState<TraceStep[] | null>(null);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void pyodideClient
        .traceCode(code)
        .then((next) => {
          if (cancelled) return;
          setSteps(visibleSteps(next, code));
          setIndex(0);
          setError('');
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(err instanceof Error ? err.message : '无法逐步执行');
        });
    };
    const stop = pyodideClient.onStatusChange((status) => {
      if (status === 'ready') load();
    });
    return () => {
      cancelled = true;
      stop();
      setStepCursor(sceneId, null);
    };
  }, [code, sceneId]);

  const step = steps?.[index];
  useEffect(() => {
    setStepCursor(sceneId, step?.done ? null : (step?.line ?? null));
  }, [sceneId, step]);

  const lineText = step?.line ? code.split('\n')[step.line - 1] ?? '' : '';
  const objects: Array<{ key: string; names: string[]; item: TraceVar }> = [];
  const scalars: TraceVar[] = [];
  const seen = new Map<number, number>();
  for (const item of step?.vars ?? []) {
    const container = item.kind === 'set' || item.kind === 'list' || item.kind === 'tuple' || item.kind === 'dict';
    if (!container || item.id == null) {
      scalars.push(item);
      continue;
    }
    const at = seen.get(item.id);
    if (at == null) {
      seen.set(item.id, objects.length);
      objects.push({ key: String(item.id), names: [item.name], item });
    } else {
      objects[at]!.names.push(item.name);
    }
  }

  const caption = !step
    ? '正在记录每一步…'
    : step.done
      ? '运行结束'
      : `即将执行第 ${step.line} 行`;

  return (
    <div className="mt-4 rounded-2xl border border-classroom-border bg-classroom-stage p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xl font-semibold text-text-primary">{caption}</p>
        <p className="text-base text-text-secondary">
          {steps && steps.length > 0 ? `${index + 1} / ${steps.length}` : ''}
        </p>
      </div>
      {error && <p className="mb-3 text-lg text-error">{error}</p>}
      <div className="mb-3 min-h-24 rounded-xl bg-classroom-playground px-4 py-4">
        {step && (objects.length > 0 || scalars.length > 0) ? (
          <>
            {objects.map((group) => (
              <div
                key={group.key}
                className={`mb-5 flex gap-3 last:mb-0 ${group.item.pairs?.some((pair) => pair.items) ? 'flex-col' : 'items-start'}`}
              >
                <div className="flex shrink-0 flex-col">
                  {group.names.map((name) => (
                    <span key={name} className="whitespace-nowrap font-mono text-2xl font-semibold text-text-primary">
                      {name} <span className="text-accent">→</span>
                    </span>
                  ))}
                </div>
                <ObjectView item={group.item} names={group.names} line={lineText} code={code} />
              </div>
            ))}
            {scalars.map((item) => (
              <p key={item.name} className="font-mono text-xl text-text-primary">
                {item.name} = {item.value}
              </p>
            ))}
          </>
        ) : (
          <p className="text-lg text-text-secondary">还没有对象</p>
        )}
      </div>
      {step?.stdout ? (
        <pre className="mb-3 whitespace-pre-wrap font-mono text-lg text-text-primary">{step.stdout}</pre>
      ) : null}
      <div className="flex gap-3">
        <button
          type="button"
          className="rounded-lg border border-classroom-border px-4 py-2 text-lg"
          disabled={!steps || index <= 0}
          onClick={() => setIndex((n) => Math.max(0, n - 1))}
        >
          上一步
        </button>
        <button
          type="button"
          className="rounded-lg bg-accent px-4 py-2 text-lg text-white"
          disabled={!steps || index >= steps.length - 1}
          onClick={() => setIndex((n) => n + 1)}
        >
          下一步
        </button>
      </div>
    </div>
  );
}
