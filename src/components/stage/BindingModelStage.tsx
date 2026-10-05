import { useState } from 'react';
import type { BindingModelContent } from '../../types/scene';

interface Props {
  content: BindingModelContent;
  sceneId: string;
}

/** 0 名字找到对象 → 1 从对象取 id → 2 两个名字同一对象 → 3 两侧模型 */
export function BindingModelStage({ content }: Props) {
  const [phase, setPhase] = useState(0);
  const [play, setPlay] = useState(0);
  const showId = phase >= 1;
  const showAlias = phase >= 2;
  const showModel = phase >= 3;

  const advance = () => setPhase((p) => Math.min(p + 1, 3));

  return (
    <div
      key={play}
      className="mt-2 cursor-pointer select-none space-y-3"
      onClick={advance}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advance();
        }
      }}
    >
      <svg viewBox="0 0 760 280" className="w-full h-56" role="img" aria-label="名字经查找找到对象，再取 identity">
        <text x="36" y="24" fontSize="15" className="fill-text-secondary">
          Namespace
        </text>
        <rect x="16" y="36" width="230" height="200" rx="16" className="fill-none stroke-accent" strokeWidth="2" />
        <text x="40" y="214" fontSize="13" className="fill-text-secondary">
          ↑ scope
        </text>

        <text x="40" y="88" fontSize="22" className="fill-text-primary">
          {showAlias ? '"a"' : '"x"'}
        </text>
        <text x="40" y="112" fontSize="13" className="fill-text-secondary">
          name
        </text>
        <g className={`transition-opacity duration-500 ${showAlias ? 'opacity-100' : 'opacity-0'}`}>
          <text x="40" y="160" fontSize="22" className="fill-text-primary">
            "b"
          </text>
          <text x="40" y="184" fontSize="13" className="fill-text-secondary">
            name
          </text>
        </g>

        <text x="470" y="24" fontSize="15" className="fill-text-secondary">
          Object · heap
        </text>
        <rect x="430" y="36" width="300" height="150" rx="16" className="fill-accent-muted stroke-accent" strokeWidth="2" />
        <text x="454" y="78" fontSize="16" className="fill-text-secondary">
          {showAlias ? 'list 对象' : 'int 对象'}
        </text>
        <text x="580" y="118" textAnchor="middle" fontSize="26" className="fill-text-primary">
          {showAlias ? '[1, 2, 3]' : '1000'}
        </text>
        <text x="454" y="158" fontSize="14" className="fill-text-secondary">
          identity
        </text>

        <line
          x1="150"
          y1="80"
          x2="430"
          y2="100"
          className="stroke-accent"
          strokeWidth="3"
          markerEnd="url(#lookup-arrow)"
        />
        <text x="250" y="72" fontSize="14" className="fill-accent">
          lookup
        </text>
        <line
          x1="150"
          y1="152"
          x2="430"
          y2="120"
          className={`stroke-accent transition-opacity duration-500 ${showAlias ? 'opacity-100' : 'opacity-0'}`}
          strokeWidth="3"
          markerEnd="url(#lookup-arrow)"
        />

        <g className={`transition-opacity duration-500 ${showId ? 'opacity-100' : 'opacity-0'}`}>
          <line x1="580" y1="186" x2="580" y2="228" className="stroke-accent" strokeWidth="3" markerEnd="url(#lookup-arrow)" />
          <text x="600" y="250" fontSize="16" className="fill-text-primary">
            id(object)
          </text>
        </g>
        <defs>
          <marker id="lookup-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-accent" />
          </marker>
        </defs>
      </svg>

      <p className="title-kai text-xl text-text-primary leading-relaxed">
        {phase === 0 && '先通过名字找到对象。id(x) 不是变量名 x 的 ID。'}
        {phase === 1 && '再取得这个对象的 identity。x = 1000 时，取的是 int 对象 1000 的身份。'}
        {phase === 2 &&
          'a = [1, 2, 3]，b = a。两次 id 相同，不是因为 a 和 b 是同一个变量，而是两个名字绑定到了同一个对象。'}
        {phase === 3 && content.summary}
      </p>

      {showModel && (
        <div className="grid grid-cols-2 gap-3 timeline-node-in">
          <div className="rounded-3xl bg-classroom-stage shadow-card px-4 py-3">
            <p className="title-kai text-base text-accent mb-1">名字这一侧</p>
            <p className="title-kai text-lg text-text-primary leading-relaxed">名称、所属 Namespace、Scope、当前绑定</p>
          </div>
          <div className="rounded-3xl bg-classroom-stage shadow-card px-4 py-3">
            <p className="title-kai text-base text-accent mb-1">对象这一侧</p>
            <p className="title-kai text-lg text-text-primary leading-relaxed">Identity 身份、Type 类型、Value 值</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-base text-accent/80">{phase < 3 ? '点击继续 · 或按空格 / →' : ''}</p>
        <button
          type="button"
          className="rounded-full border border-accent px-4 py-1.5 title-kai text-base text-accent hover:bg-accent-muted"
          onClick={(e) => {
            e.stopPropagation();
            setPhase(0);
            setPlay((n) => n + 1);
          }}
        >
          再播一次
        </button>
      </div>
    </div>
  );
}
