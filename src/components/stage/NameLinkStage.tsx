import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { NameLinkContent } from '../../types/scene';

interface Props {
  content: NameLinkContent;
  sceneId: string;
}

const ENTRIES = [
  { key: 'age', type: 'int', value: '18' },
  { key: 'name', type: 'str', value: '"Tom"' },
  { key: 'score', type: 'int', value: '95' },
];

export function NameLinkStage({ content, sceneId }: Props) {
  const { phase, advance, done } = useStageAdvance(sceneId, 3);
  const showSummary = phase >= 3;

  return (
    <div
      className="mt-4 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && advance()) event.preventDefault();
      }}
    >
      {content.mode === 'alias' ? <AliasFork phase={phase} /> : <NamespaceMemory phase={phase} />}

      {!showSummary && (
        <p key={phase} className="mt-3 title-kai text-xl text-text-secondary timeline-node-in leading-relaxed">
          {content.mode === 'alias' ? aliasStepNote(phase) : namespaceStepNote(phase)}
        </p>
      )}

      {showSummary && (
        <p className="mt-3 rounded-3xl bg-accent-muted px-6 py-4 title-kai text-xl text-text-primary leading-relaxed timeline-node-in">
          {content.summary}
        </p>
      )}

      {!done && <p className="mt-4 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}

function aliasStepNote(phase: number): string {
  if (phase <= 0) return 'a = 18，名字 a 指向对象 18';
  if (phase === 1) return '接下来 b = a。b 会指向谁？';
  return 'b 也指向这一个 18，没有复制出第二份';
}

function AliasFork({ phase }: { phase: number }) {
  const showB = phase >= 1;
  const showBArrow = phase >= 2;
  const showId = phase >= 3;
  return (
    <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-5">
      <div className="grid grid-cols-[auto_minmax(4.5rem,1fr)_11rem] grid-rows-2 items-stretch gap-x-2 gap-y-5">
        <div className="self-center">
          <AliasName name="a" />
        </div>
        <div className="self-center">
          <ArrowToObject />
        </div>
        <div className="col-start-3 row-span-2 row-start-1 h-full">
          <div
            className={`flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center ${
              showBArrow ? 'border-accent bg-accent-muted' : 'border-accent'
            }`}
          >
            <span className="font-mono text-3xl text-text-primary">18</span>
            <span className="mt-1 whitespace-nowrap text-sm text-text-secondary">
              {showId ? '同一个对象' : '对象'}
            </span>
            <span
              className={`mt-1 whitespace-nowrap font-mono text-sm text-accent transition-opacity duration-500 ${
                showId ? 'opacity-100' : 'opacity-0'
              }`}
            >
              id(a) = id(b)
            </span>
          </div>
        </div>
        <div className="self-center">
          <AliasName name="b" visible={showB} />
        </div>
        <div className="self-center">
          <ArrowToObject visible={showBArrow} />
        </div>
      </div>
    </div>
  );
}

function ArrowToObject({ visible = true }: { visible?: boolean }) {
  return (
    <div
      className={`flex items-center text-accent transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden
    >
      <div className="h-[3px] flex-1 bg-accent" />
      <div className="h-0 w-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-accent" />
    </div>
  );
}

function AliasName({ name, visible = true }: { name: string; visible?: boolean }) {
  return (
    <div className={`text-center transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="rounded-full bg-accent px-5 py-2 title-kai text-xl text-white">{name}</div>
      <p className="mt-1 text-sm text-text-secondary">名字</p>
    </div>
  );
}

function namespaceStepNote(phase: number): string {
  if (phase <= 0) return '名字空间是一张表，现在还是空的。';
  if (phase === 1) return '写入名字 "age"。表里记下它指向谁，18 写在表外。';
  return '再写入 "name"，指向另一个对象。';
}

function NamespaceMemory({ phase }: { phase: number }) {
  const shown = ENTRIES.slice(0, Math.min(phase, ENTRIES.length));
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1 overflow-hidden rounded-3xl border-2 border-accent bg-white">
        <div className="flex h-16 items-center justify-between bg-accent px-5 text-white">
          <div>
            <p className="text-lg font-semibold leading-tight">键是名字，值是它指向的对象</p>
          </div>
          <p className="font-mono text-base text-white/90">表</p>
        </div>
        {shown.length === 0 ? (
          <p className="flex h-16 items-center justify-center title-kai text-lg text-text-secondary">空的 dict</p>
        ) : (
          shown.map((entry) => (
            <div
              key={entry.key}
              className="grid h-16 grid-cols-2 items-center border-t border-classroom-border px-5 timeline-node-in"
            >
              <p className="font-mono text-2xl text-text-primary">{`"${entry.key}"`}</p>
              <p className="text-right font-mono text-lg text-accent">指向</p>
            </div>
          ))
        )}
      </div>

      <div className="w-48 shrink-0">
        <div className="flex h-16 items-end justify-center pb-1 text-sm text-text-secondary">
          {shown.length > 0 ? '对象写在表外' : '\u00a0'}
        </div>
        {shown.map((entry) => (
          <div key={entry.key} className="flex h-16 items-center gap-1 timeline-node-in">
            <div className="w-8 shrink-0">
              <ArrowToObject />
            </div>
            <div className="flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-accent bg-white text-center">
              <span className="font-mono text-xl leading-none text-text-primary">{entry.value}</span>
              <span className="text-xs leading-none text-text-secondary">{entry.type} · id</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
