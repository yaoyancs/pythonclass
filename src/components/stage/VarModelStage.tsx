import type { VarModelContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import { TypeBadge } from '../ui/TypeBadge';

interface Props {
  content: VarModelContent;
  sceneId: string;
}

export function VarModelStage({ content, sceneId }: Props) {
  const follow = content.followOn;
  const maxPhase = follow ? 8 : 4;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
  const inFollow = Boolean(follow) && phase >= 5;
  const displayPhase = inFollow ? phase - 5 : Math.min(phase, 4);
  const name = content.name ?? 'score';
  const value = content.value ?? (content.mode === 'update' ? '90' : '92');
  const nextValue = content.nextValue ?? '95';
  const kind = content.valueKind;
  const codeLines = inFollow && follow ? follow.codeLines : content.codeLines;
  const teacherLine = inFollow && follow ? follow.teacherLine : content.teacherLine;
  const updateStory = content.mode === 'update' && !inFollow;
  const showTeacher = updateStory ? false : inFollow ? displayPhase >= 1 : phase >= 1;
  const showRebindClose = Boolean(follow) && phase >= 4 && !inFollow;
  const delta = inFollow && follow ? (follow.delta ?? 5) : (content.delta ?? 5);

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
      {inFollow && follow?.question && (
        <p className="mb-4 stage-emphasis text-xl timeline-node-in">{follow.question}</p>
      )}

      <div className="rounded-3xl bg-code-bg shadow-card px-5 py-4 mb-3 font-mono text-xl text-code-text relative">
        {content.mode === 'label' && content.boardNote && phase >= 1 && !inFollow && (
          <span className="absolute -top-3 left-24 rounded-full bg-highlight text-white text-sm px-3 py-0.5 timeline-node-in">
            {content.boardNote}
          </span>
        )}
        {codeLines.map((line, i) => {
          if (updateStory) {
            return (
              <UpdateCodeLine
                key={`${line}-${i}`}
                line={line}
                index={i}
                phase={phase}
                name={name}
              />
            );
          }
          const memoryStep = inFollow ? displayPhase : phase;
          const activeLine =
            content.mode === 'label' && phase >= 4 && !inFollow
              ? 0
              : content.mode === 'update' || inFollow
                ? memoryStep === 0
                  ? 0
                  : 1
                : -1;
          return (
            <div
              key={`${line}-${i}`}
              className={
                i === activeLine ? 'bg-highlight/90 text-code-bg rounded px-2 -mx-2' : undefined
              }
            >
              {line}
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-classroom-stage shadow-card px-6 py-4 relative overflow-hidden">
        {content.mode === 'label' && !inFollow && (
          <LabelFrames phase={displayPhase} name={name} value={value} kind={kind} />
        )}
        {content.mode === 'rebind' && !inFollow && (
          <RebindFrames
            phase={displayPhase}
            name={name}
            value={value}
            nextValue={nextValue}
            kind={kind}
          />
        )}
        {(content.mode === 'update' || inFollow) && (
          <UpdateFrames
            phase={inFollow ? displayPhase : phase}
            name={name}
            value={inFollow && follow ? follow.value : value}
            nextValue={inFollow && follow ? follow.nextValue : nextValue}
            kind={kind}
            delta={delta}
          />
        )}
      </div>

      {updateStory && (
        <p key={phase} className="mt-2 title-kai text-xl text-text-secondary timeline-node-in leading-relaxed">
          {updateStepNote(phase, name, value, nextValue, delta)}
        </p>
      )}

      {showTeacher && (
        <p className="mt-4 title-kai text-xl text-text-secondary timeline-node-in leading-relaxed">
          “{teacherLine}”
        </p>
      )}

      {showRebindClose && (
        <p className="mt-4 stage-emphasis text-xl timeline-node-in">{content.conclusion}</p>
      )}

      {done && (
        <div className="mt-4 space-y-2 timeline-node-in">
          <p className="stage-emphasis text-xl">
            {follow ? follow.conclusion : content.conclusion}
          </p>
          {(follow?.humanTranslation ?? content.humanTranslation) && (
            <p className="title-kai text-lg text-text-secondary">
              人话：{follow?.humanTranslation ?? content.humanTranslation}
            </p>
          )}
        </div>
      )}

      {!done && (
        <p className="mt-3 text-base text-accent/80">
          {showRebindClose ? '点击继续 · 取出旧值再贴回去' : '点击继续 · 或按空格 / →'}
        </p>
      )}
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

function NamePill({ name }: { name: string }) {
  return (
    <div className="text-center">
      <div className="rounded-full bg-accent text-white px-5 py-2 title-kai text-xl">{name}</div>
      <p className="mt-2 text-sm text-text-secondary">名字</p>
    </div>
  );
}

function ObjectPill({
  value,
  label,
  faded,
  active,
  pulse,
  kind,
}: {
  value: string;
  label: string;
  faded?: boolean;
  active?: boolean;
  pulse?: boolean;
  kind?: string;
}) {
  return (
    <div className={`text-center transition-opacity duration-700 ${faded ? 'opacity-30' : 'opacity-100'}`}>
      <div
        className={`relative rounded-2xl border-2 border-dashed px-8 py-3 font-mono text-3xl text-text-primary ${
          faded ? 'border-classroom-border' : active ? 'border-accent bg-accent-muted' : 'border-accent'
        } ${pulse ? 'animate-pulse' : ''}`}
      >
        {value}
        {kind && !faded && (
          <span className="absolute -top-2 -right-2">
            <TypeBadge kind={kind} />
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </div>
  );
}

const LINE_HI = 'bg-highlight/90 text-code-bg rounded px-1';

function updateStepNote(
  phase: number,
  name: string,
  value: string,
  nextValue: string,
  delta: number,
): string {
  if (phase <= 0) return `现在 ${name} 指向 ${value}`;
  if (phase === 1) return `右边是读取：取出 ${value}`;
  if (phase === 2) return `${value} + ${delta} 得到新对象 ${nextValue}，${value} 还在`;
  if (phase === 3) return `名字改指向 ${nextValue}，${value} 没有变成 ${nextValue}`;
  return `打印的是 ${name} 现在指向的对象`;
}

function UpdateCodeLine({
  line,
  index,
  phase,
  name,
}: {
  line: string;
  index: number;
  phase: number;
  name: string;
}) {
  const wholeLine = (index === 0 && phase === 0) || (index >= 2 && phase >= 4);
  return (
    <div className={wholeLine ? 'bg-highlight/90 text-code-bg rounded px-2 -mx-2' : undefined}>
      {index === 1 ? highlightSelfAssign(line, name, phase) : line}
    </div>
  );
}

function highlightSelfAssign(line: string, name: string, phase: number) {
  const first = line.indexOf(name);
  const second = first < 0 ? -1 : line.indexOf(name, first + name.length);
  const plus = second < 0 ? -1 : line.indexOf('+', second);
  if (first < 0 || second < 0 || plus < 0) return line;
  return (
    <>
      {line.slice(0, first)}
      <span className={phase === 3 ? LINE_HI : undefined}>{line.slice(first, first + name.length)}</span>
      {line.slice(first + name.length, second)}
      <span className={phase === 1 ? LINE_HI : undefined}>{line.slice(second, second + name.length)}</span>
      {line.slice(second + name.length, plus)}
      <span className={phase === 2 ? LINE_HI : undefined}>{line.slice(plus)}</span>
    </>
  );
}

/** 两格对象固定不动，箭头从旧对象移到新对象。 */
function UpdateFrames({
  phase,
  name,
  value,
  nextValue,
  kind,
  delta = 5,
}: {
  phase: number;
  name: string;
  value: string;
  nextValue: string;
  kind?: string;
  delta?: number;
}) {
  const showNext = phase >= 2;
  const rebound = phase >= 3;
  const printed = phase >= 4;

  return (
    <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
      <NamePill name={name} />
      <BindingArrow rebound={rebound} />
      <div className="flex flex-col gap-3">
        <ObjectPill
          value={value}
          label={rebound ? '原来的对象' : '对象'}
          faded={rebound}
          active={phase === 1}
          pulse={phase === 1}
          kind={kind}
        />
        {showNext ? (
          <div className={phase === 2 ? 'timeline-node-in' : undefined}>
            <ObjectPill
              value={nextValue}
              label={printed ? `print(${name}) → ${nextValue}` : rebound ? '对象' : `${value} + ${delta}`}
              active={rebound}
              kind={kind}
            />
          </div>
        ) : (
          <EmptyObjectSlot value={nextValue} />
        )}
      </div>
    </div>
  );
}

function BindingArrow({ rebound }: { rebound: boolean }) {
  const originY = 87;
  const targetY = rebound ? 153 : 26;
  const reach = 248;
  const angle = Math.atan2(targetY - originY, reach);
  const length = Math.hypot(reach, targetY - originY);
  return (
    <div className="relative h-[210px] w-[236px] shrink-0 text-accent" aria-hidden>
      <div
        className="absolute left-0 transition-transform duration-700 ease-out"
        style={{ top: originY, transform: `rotate(${angle}rad)`, transformOrigin: '0 0' }}
      >
        <svg width={length} height="16" viewBox={`0 0 ${length} 16`} className="overflow-visible -translate-y-2">
          <line x1="0" y1="8" x2={Math.max(length - 14, 0)} y2="8" stroke="currentColor" strokeWidth="3" />
          <polygon points={`${length},8 ${length - 16},1 ${length - 16},15`} fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function EmptyObjectSlot({ value }: { value: string }) {
  return (
    <div className="text-center">
      <div className="rounded-2xl border-2 border-dashed border-classroom-border px-8 py-3 font-mono text-3xl text-transparent">
        {value}
      </div>
      <p className="mt-1 text-sm text-text-secondary">新对象</p>
    </div>
  );
}
