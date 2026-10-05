import type { ExprOrderContent } from '../../types/scene';

interface Props {
  content: ExprOrderContent;
}

/** 进页一次展示优先级表和对照例子。 */
export function ExprOrderStage({ content }: Props) {
  return (
    <div className="mt-4 select-none space-y-4">
      <div className="divide-y divide-classroom-border overflow-hidden rounded-3xl bg-classroom-stage shadow-card">
        {content.tiers.map((tier) => (
          <div
            key={tier.rank}
            className="grid grid-cols-[4.5rem_8.5rem_1fr] items-baseline gap-3 px-6 py-3"
          >
            <p className="text-sm text-text-secondary">{tier.rank}</p>
            <p className="font-mono text-2xl text-accent">{tier.ops}</p>
            <p className="text-lg text-text-primary">{tier.note}</p>
          </div>
        ))}
      </div>

      <ul className="space-y-3">
        {content.cases.map((item) => (
          <li key={item.expr} className="rounded-3xl bg-classroom-stage px-6 py-4 shadow-card">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-2xl text-text-primary">{item.expr}</p>
              <p className="shrink-0 font-mono text-2xl text-accent">→ {item.result}</p>
            </div>
            <p className="mt-2 text-base leading-relaxed text-text-secondary">{item.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
