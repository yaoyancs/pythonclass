import { useEffect, useState } from 'react';
import type { PlaylistBoardContent } from '../../types/scene';

interface Props {
  content: PlaylistBoardContent;
  sceneId: string;
}

export function PlaylistBoardStage({ content, sceneId }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const name = content.bindingName ?? 'songs';
  const songs = content.songs;
  const closingColumn = 4 + songs.length * 2 - 1;

  useEffect(() => {
    setSelected(null);
  }, [sceneId]);

  const song = selected === null ? '' : songs[selected];

  return (
    <div className="mt-8">
      <div className="overflow-x-auto rounded-3xl bg-code-bg px-6 py-8 shadow-card">
        <div
          className="mx-auto grid w-max items-center gap-x-3 font-mono text-[clamp(1.5rem,2.6vw,2.5rem)] leading-none text-code-text"
          style={{ gridTemplateColumns: `repeat(${3 + songs.length * 2}, auto)` }}
        >
          <span style={{ gridColumn: 1, gridRow: 1 }}>{name}</span>
          <span style={{ gridColumn: 2, gridRow: 1 }}>=</span>
          <span style={{ gridColumn: 3, gridRow: 1 }}>[</span>
          {songs.map((title, index) => {
            const column = 4 + index * 2;
            const on = selected === index;
            return (
              <span key={`${title}-${index}`} className="contents">
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  className={`rounded-xl px-2 py-2 text-center transition-colors ${
                    on ? 'bg-accent text-white' : 'hover:bg-white/10'
                  }`}
                  style={{ gridColumn: column, gridRow: 1 }}
                >
                  "{title}"
                </button>
                <span
                  className="mt-3 text-center text-[0.62em] text-highlight-muted"
                  style={{ gridColumn: column, gridRow: 2 }}
                >
                  {index}
                </span>
                {index < songs.length - 1 && (
                  <span style={{ gridColumn: column + 1, gridRow: 1 }}>,</span>
                )}
              </span>
            );
          })}
          <span style={{ gridColumn: closingColumn, gridRow: 1 }}>]</span>
        </div>
      </div>
      <p className="mt-6 text-2xl leading-relaxed text-text-primary">
        {selected === null ? (
          <>
            点一项。索引写在列表名后面的方括号里，从 0 开始，例如{' '}
            <span className="font-mono">{name}[0]</span>。
          </>
        ) : (
          <>
            <span className="font-mono">
              {name}[{selected}]
            </span>
            {' 取出 '}
            <span className="font-mono text-accent">"{song}"</span>
            。这是第 {selected + 1} 项，位置是 {selected}。
          </>
        )}
      </p>
    </div>
  );
}
