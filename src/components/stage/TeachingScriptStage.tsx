import type { SceneContent } from '../../types/scene';

type Script = NonNullable<SceneContent['teachingScript']>;

export function TeachingScriptStage({ script }: { script: Script }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent">
          {script.cue}
        </span>
        {script.pauseSeconds && (
          <span className="text-sm text-text-secondary">建议停留 {script.pauseSeconds} 秒</span>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border border-classroom-border bg-classroom-stage px-6 py-5">
        {script.lines.map((line) => (
          <p key={line} className="text-xl font-medium leading-relaxed text-text-primary">
            {line}
          </p>
        ))}
      </div>

      {script.question && (
        <div className="rounded-2xl border-l-4 border-highlight bg-highlight/10 px-6 py-4">
          <p className="text-sm font-semibold text-highlight">停一下，问学生</p>
          <p className="mt-1 text-xl font-semibold text-text-primary">{script.question}</p>
        </div>
      )}

      {script.keyPoint && (
        <p className="rounded-2xl bg-accent/10 px-6 py-4 text-lg font-semibold text-accent">
          板书落点：{script.keyPoint}
        </p>
      )}
    </div>
  );
}
