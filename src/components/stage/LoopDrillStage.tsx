import type { LoopDrillContent } from '../../types/scene';

function Sample({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-base font-semibold text-accent">{label}</p>
      <pre className="mt-1 whitespace-pre-wrap rounded-2xl bg-white px-3 py-1 font-mono text-sm leading-snug">{text}</pre>
    </div>
  );
}

/** 右侧题面：情境、任务、输入输出。左侧留给学生写程序。 */
export function LoopDrillStage({ content }: { content: LoopDrillContent }) {
  return (
    <div>
      <p className="text-lg font-semibold text-accent">第 {content.index} 题</p>
      <h2 className="title-stage mt-1 text-3xl leading-tight text-text-primary">{content.title}</h2>
      {content.image && (
        <img
          src={content.image.src}
          alt={content.image.alt}
          className="mt-3 h-24 w-full rounded-2xl bg-white object-contain"
        />
      )}
      {content.situation && (
        <section className="mt-2">
          <h3 className="text-lg font-semibold text-accent">任务背景</h3>
          <div className="mt-1 space-y-1">
            {content.situation.map((line) => (
              <p key={line} className="text-base leading-snug text-text-primary">
                {line}
              </p>
            ))}
          </div>
        </section>
      )}
      {content.problem && <p className="mt-3 text-lg leading-relaxed text-text-primary">{content.problem}</p>}
      <section className="mt-2">
        <h3 className="text-lg font-semibold text-accent">任务描述</h3>
        <p className="mt-1 text-lg leading-relaxed text-text-primary">{content.task}</p>
        <ul className="mt-1 space-y-0.5">
          {content.rules.map((rule) => (
            <li key={rule} className="text-lg leading-relaxed text-text-primary">
              <span className="mr-2 text-accent">·</span>
              {rule}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-lg font-semibold leading-snug text-text-primary">{content.goal}</p>
      </section>
      {(content.inputFormat || content.outputFormat) && (
        <div className="mt-2 grid grid-cols-2 gap-3">
          {content.inputFormat && (
            <div>
              <p className="text-base font-semibold text-accent">输入格式</p>
              <p className="mt-1 text-base leading-relaxed text-text-primary">{content.inputFormat}</p>
            </div>
          )}
          {content.outputFormat && (
            <div>
              <p className="text-base font-semibold text-accent">输出格式</p>
              <p className="mt-1 text-base leading-relaxed text-text-primary">{content.outputFormat}</p>
            </div>
          )}
        </div>
      )}
      <div className="mt-2 grid grid-cols-2 gap-3">
        <Sample label="输入样例" text={content.sampleInput} />
        <Sample label="输出样例" text={content.sampleOutput} />
      </div>
      {content.sampleNote && (
        <p className="mt-2 text-base leading-relaxed text-text-secondary">{content.sampleNote}</p>
      )}
    </div>
  );
}
