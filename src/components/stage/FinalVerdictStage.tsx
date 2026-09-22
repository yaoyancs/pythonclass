import type { FinalVerdictContent } from '../../types/scene';

interface Props {
  content: FinalVerdictContent;
  sceneId: string;
}

export function FinalVerdictStage({ content }: Props) {
  return (
    <div className="mt-4 select-none">
      <div className="space-y-4">
        {content.lines.map((line, i) => (
          <p
            key={line}
            className={`leading-relaxed ${
              i === 0
                ? 'title-stage text-3xl text-text-primary'
                : 'text-2xl font-semibold text-text-primary'
            }`}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-classroom-stage shadow-card px-6 py-5">
        <p className="text-sm tracking-[0.18em] text-accent mb-3">我能够：</p>
        <ul className="space-y-2">
          {content.abilities.map((a) => (
            <li key={a} className="text-lg flex gap-3">
              <span className="text-accent">✓</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-sm tracking-[0.18em] text-highlight mb-2">下一课悬念</p>
        <pre className="rounded-3xl bg-code-bg shadow-card px-5 py-4 font-mono text-lg text-code-text whitespace-pre-wrap">
          {content.teaserCode}
        </pre>
        <p className="mt-4 stage-emphasis text-xl">{content.teaserQuestion}</p>
        <p className="mt-3 title-kai text-lg text-text-secondary">{content.teaserClose}</p>
      </div>
    </div>
  );
}
