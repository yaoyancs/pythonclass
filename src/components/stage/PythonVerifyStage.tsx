import type { PythonVerifyContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: PythonVerifyContent;
  sceneId: string;
}

/**
 * 验收三步 + 常见坑：确认环境真的能跑 Hello。
 */
export function PythonVerifyStage({ content, sceneId }: Props) {
  // 0..n-1 checks → n pitfalls → n+1 success
  const maxPhase = content.checks.length + 1;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const checksVisible = Math.min(phase + 1, content.checks.length);
  const showPitfalls = phase >= content.checks.length;
  const showSuccess = phase >= content.checks.length + 1;

  return (
    <div
      className="mt-4 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advance();
        }
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.checks.slice(0, checksVisible).map((check, i) => (
          <div
            key={check.label}
            className="rounded-3xl bg-classroom-stage shadow-card px-5 py-5 digest-station-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-2xl bg-accent text-white grid place-items-center title-kai">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="title-kai text-xl text-text-primary">{check.label}</p>
            </div>
            <p className="text-base text-text-secondary leading-relaxed font-mono">{check.detail}</p>
          </div>
        ))}
      </div>

      {showPitfalls && (
        <div className="mt-6 rounded-3xl bg-highlight-muted px-6 py-5 digest-station-in">
          <p className="text-sm tracking-[0.18em] text-highlight mb-3">常见坑</p>
          <ul className="space-y-2.5">
            {content.pitfalls.map((p) => (
              <li key={p} className="flex items-baseline gap-3 text-lg text-text-primary">
                <span className="text-highlight shrink-0">×</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuccess && (
        <div className="mt-5 rounded-3xl bg-accent text-white px-6 py-5 text-center digest-result-pop">
          <p className="title-kai text-2xl leading-relaxed">{content.successLine}</p>
        </div>
      )}

      {!done && (
        <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>
      )}
    </div>
  );
}
