import type { SyntaxRulesContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: SyntaxRulesContent;
  sceneId: string;
}

export function SyntaxRulesStage({ content, sceneId }: Props) {
  // 0 规则 → 1 故意错误 → 2 三步读错
  const { phase, advance, done } = useStageAdvance(sceneId, 2);

  return (
    <div
      className="mt-4 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && advance()) e.preventDefault();
      }}
    >
      <ol className="space-y-2">
        {content.rules.map((rule, i) => (
          <li
            key={rule}
            className="rounded-2xl bg-classroom-stage shadow-card px-5 py-3 text-lg flex gap-4 timeline-node-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="text-accent tabular-nums">{i + 1}.</span>
            <span>{rule}</span>
          </li>
        ))}
      </ol>

      {phase >= 1 && (
        <div className="mt-5 grid grid-cols-2 gap-4 timeline-node-in">
          <div className="rounded-3xl bg-code-bg shadow-card px-5 py-4">
            <p className="text-sm text-code-muted mb-2">故意运行</p>
            <pre className="font-mono text-xl text-code-error">{content.brokenCode}</pre>
          </div>
          <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-4 font-mono text-sm text-error leading-relaxed">
            <p>File "hello.py", line 1</p>
            <p className="mt-1">print("Hello)</p>
            <p className="mt-1"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^</p>
            <p className="mt-2">SyntaxError: unterminated string literal</p>
          </div>
        </div>
      )}

      {phase >= 2 && (
        <div className="mt-5 rounded-3xl bg-accent-muted px-6 py-5 timeline-node-in">
          <p className="text-sm tracking-[0.18em] text-accent mb-3">只做三步</p>
          <ol className="space-y-2 text-lg">
            {content.fixSteps.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="text-accent">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
