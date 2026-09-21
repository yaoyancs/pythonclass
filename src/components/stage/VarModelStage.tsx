import type { VarModelContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import { TypeBadge } from '../ui/TypeBadge';

interface Props {
  content: VarModelContent;
  sceneId: string;
}

export function VarModelStage({ content, sceneId }: Props) {
  const maxPhase = 4;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const name = content.name ?? 'score';
  const value = content.value ?? (content.mode === 'update' ? '90' : '92');
  const nextValue = content.nextValue ?? '95';
  const kind = content.valueKind;

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
      <div className="rounded-3xl bg-code-bg shadow-card px-5 py-4 mb-5 font-mono text-xl text-code-text relative">
        {content.mode === 'label' && content.boardNote && phase >= 1 && (
          <span className="absolute -top-3 left-24 rounded-full bg-highlight text-white text-sm px-3 py-0.5 timeline-node-in">
            {content.boardNote}
          </span>
        )}
        {content.codeLines.map((line, i) => (
          <div
            key={`${line}-${i}`}
            className={
              content.mode === 'label' && phase >= 4 && i === 0
                ? 'bg-highlight/90 text-code-bg rounded px-2 -mx-2'
                : undefined
            }
          >
            {line}
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-classroom-stage shadow-card px-6 py-8 min-h-[15rem] relative overflow-hidden">
        {content.mode === 'label' && (
          <LabelFrames phase={phase} name={name} value={value} kind={kind} />
        )}
        {content.mode === 'rebind' && (
          <RebindFrames
            phase={phase}
            name={name}
            value={value}
            nextValue={nextValue}
            kind={kind}
          />
        )}
        {content.mode === 'update' && (
          <UpdateFrames phase={phase} name={name} value={value} nextValue={nextValue} kind={kind} />
        )}
      </div>

      {phase >= 1 && (
        <p className="mt-4 title-kai text-xl text-text-secondary timeline-node-in leading-relaxed">
          “{content.teacherLine}”
        </p>
      )}

      {done && (
        <div className="mt-4 space-y-2 timeline-node-in">
          <p className="stage-emphasis text-xl">{content.conclusion}</p>
          {content.humanTranslation && (
            <p className="title-kai text-lg text-text-secondary">
              人话：{content.humanTranslation}
            </p>
          )}
        </div>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}

function ValueCard({
  value,
  kind,
  showKind,
  faded,
  active,
}: {
  value: string;
  kind?: string;
  showKind?: boolean;
  faded?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed px-8 py-6 text-3xl font-mono transition-all duration-700 ${
        faded
          ? 'opacity-25 border-classroom-border'
          : active
            ? 'opacity-100 scale-100 border-accent bg-accent-muted'
            : 'opacity-100 scale-100 border-accent'
      }`}
    >
      {value}
      {kind && showKind && (
        <span className="absolute -top-2 -right-2 timeline-node-in">
          <TypeBadge kind={kind} />
        </span>
      )}
    </div>
  );
}

function LabelFrames({
  phase,
  name,
  value,
  kind,
}: {
  phase: number;
  name: string;
  value: string;
  kind?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-6 h-44">
      <div
        className={`rounded-full bg-accent text-white px-5 py-2 title-kai text-xl transition-all duration-700 ${
          phase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        {name}
      </div>
      <div
        className={`h-0.5 bg-accent transition-all duration-700 ${
          phase >= 3 ? 'w-16 opacity-100' : 'w-0 opacity-0'
        }`}
      />
      <div
        className={`transition-all duration-700 ${
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <ValueCard value={value} kind={kind} showKind={phase >= 3} />
      </div>
      {phase >= 4 && (
        <p className="absolute bottom-4 right-6 text-sm text-accent timeline-node-in">已执行 ✓</p>
      )}
      {phase >= 3 && (
        <p className="absolute bottom-4 left-6 text-base text-text-secondary">
          {name} ─────→ {value}
        </p>
      )}
    </div>
  );
}

function RebindFrames({
  phase,
  name,
  value,
  nextValue,
  kind,
}: {
  phase: number;
  name: string;
  value: string;
  nextValue: string;
  kind?: string;
}) {
  const moved = phase >= 3;
  return (
    <div className="relative h-44 flex items-center justify-center">
      <div className="flex items-center gap-10">
        <ValueCard value={value} kind={kind} showKind={phase >= 1} faded={moved} />
        <div
          className={`transition-all duration-700 ${
            moved ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <ValueCard value={nextValue} kind={kind} showKind={moved} active />
        </div>
      </div>
      <div
        className={`absolute top-8 left-1/2 -translate-x-1/2 rounded-full bg-accent text-white px-5 py-2 title-kai text-xl transition-all duration-700 ${
          phase >= 1 ? 'opacity-100' : 'opacity-0'
        } ${moved ? 'translate-x-10' : '-translate-x-16'}`}
      >
        {name}
      </div>
      {phase >= 1 && phase < 3 && (
        <p className="absolute bottom-4 text-base text-text-secondary">
          第二次赋值：不是把 {value} 改成 {nextValue}，而是改指向
        </p>
      )}
      {phase >= 4 && (
        <p className="absolute bottom-4 title-kai text-lg text-accent">
          print({name}) → {nextValue}
        </p>
      )}
    </div>
  );
}

function UpdateFrames({
  phase,
  name,
  value,
  nextValue,
  kind,
}: {
  phase: number;
  name: string;
  value: string;
  nextValue: string;
  kind?: string;
}) {
  const sticker = kind ? `  ·  ${kind}` : '';
  const frames = [
    { t: `读取右边当前的 ${name}`, d: `${name} ─────→ ${value}${sticker}` },
    { t: '计算右边的表达式', d: `${value} + 5 → ${nextValue}` },
    { t: '重新赋值', d: `${name} ─────→ ${nextValue}${sticker}` },
    { t: '输出', d: nextValue },
  ];
  const n = Math.min(phase + 1, 4);
  return (
    <div className="space-y-3">
      {frames.slice(0, n).map((f, i) => (
        <div
          key={f.t}
          className={`rounded-2xl px-5 py-3 timeline-node-in ${
            i === n - 1 ? 'bg-accent text-white' : 'bg-accent-muted text-text-primary'
          }`}
        >
          <p className="text-lg">第 {i + 1} 步：{f.t}</p>
          <p className={`font-mono text-base mt-1 ${i === n - 1 ? 'text-white/90' : 'text-text-secondary'}`}>
            {f.d}
          </p>
        </div>
      ))}
    </div>
  );
}
