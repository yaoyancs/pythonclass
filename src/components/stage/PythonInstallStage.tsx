import type { PythonInstallContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: PythonInstallContent;
  sceneId: string;
}

/**
 * 安装顺序插画：先解释器后编辑器 + 可点击下载链接。
 */
export function PythonInstallStage({ content, sceneId }: Props) {
  const maxPhase = content.steps.length + 1; // steps 逐个 + 最后编辑器卡片
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const stepsVisible = Math.min(phase, content.steps.length);
  const showEditors = phase > content.steps.length;

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
      <p className="title-kai text-xl md:text-2xl text-text-primary leading-relaxed">{content.lead}</p>
      <p className="mt-2 text-lg text-accent font-medium">{content.orderNote}</p>

      <div className="mt-6 relative rounded-3xl bg-classroom-stage shadow-card px-5 py-6 overflow-hidden">
        <div className="absolute left-10 right-10 top-[4.5rem] h-2.5 rounded-full bg-classroom-playground" />
        <div
          className="absolute left-10 top-[4.5rem] h-2.5 rounded-full bg-accent/30 transition-all duration-700"
          style={{
            width:
              stepsVisible <= 0
                ? '0%'
                : `calc(${stepsVisible} / ${content.steps.length} * (100% - 5rem))`,
          }}
        />

        <div className="relative grid grid-cols-4 gap-3">
          {content.steps.map((step, i) => {
            const on = i < stepsVisible;
            return (
              <div
                key={step.title}
                className={`flex flex-col items-center text-center transition-all duration-500 ${
                  on ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl grid place-items-center title-kai text-xl shadow-card ${
                    on ? 'bg-accent text-white digest-station-in' : 'bg-classroom-playground text-text-secondary'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p className="mt-3 text-sm tracking-[0.14em] text-accent">{step.title}</p>
                <p className="mt-1 text-sm text-text-secondary leading-snug px-1">{step.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-5" onClick={(e) => e.stopPropagation()}>
          <a
            href={content.pythonLink.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-accent underline underline-offset-4 text-base"
          >
            {content.pythonLink.label} ↗
          </a>
        </div>
      </div>

      {showEditors && (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 digest-station-in">
          {content.editors.map((ed) => (
            <div
              key={ed.name}
              className={`rounded-3xl shadow-card px-5 py-4 ${
                ed.primary ? 'bg-accent-muted border-2 border-accent/40' : 'bg-classroom-stage'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="title-kai text-xl text-text-primary">{ed.name}</p>
                {ed.primary && (
                  <span className="text-xs tracking-[0.16em] text-accent">本课主推</span>
                )}
              </div>
              <p className="mt-2 text-base text-text-secondary">{ed.role}</p>
              <a
                href={ed.href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-accent underline underline-offset-4"
              >
                打开下载页 ↗
              </a>
              <p className="mt-1 text-sm text-text-secondary break-all">{ed.href}</p>
            </div>
          ))}
        </div>
      )}

      {!done && (
        <p className="mt-5 text-base text-accent/80">
          {stepsVisible < content.steps.length
            ? `点击继续 · 安装步骤 ${stepsVisible}/${content.steps.length}`
            : '点击继续 · 选择编辑器'}
        </p>
      )}
    </div>
  );
}
