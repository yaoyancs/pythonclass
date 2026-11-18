import { useState } from 'react';

const INITIAL = ['晴天', '稻香', '夜曲'];

function normalize(name: string) {
  return name.trim();
}

function summary(playlist: string[]) {
  if (playlist.length === 0) return '共 0 首，第一首 无';
  return `共 ${playlist.length} 首，第一首 ${playlist[0]}`;
}

/** 与综合应用同一组操作：加入、按次数加入、从列表中抽取。 */
export function PlaylistFormStage() {
  const [playlist, setPlaylist] = useState(INITIAL);
  const [name, setName] = useState('');
  const [picked, setPicked] = useState('');

  const add = (count: number) => {
    const song = normalize(name);
    if (!song) {
      setPicked('歌名为空');
      return;
    }
    setPlaylist((prev) => [...prev, ...Array.from({ length: count }, () => song)]);
    setName('');
    setPicked('');
  };

  const pick = () => {
    if (playlist.length === 0) {
      setPicked('抽到：无');
      return;
    }
    const song = playlist[Math.floor(Math.random() * playlist.length)];
    setPicked(`抽到：${song}`);
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-classroom-border bg-white p-4 shadow-sm">
      <p className="mb-2 text-lg font-semibold text-text-primary">歌单</p>
      <pre className="mb-2 min-h-28 rounded-lg bg-code-bg px-3 py-2 font-mono text-base leading-7 text-code-text">
        {playlist.join('\n')}
      </pre>
      <p className="mb-3 text-sm text-text-secondary">{summary(playlist)}</p>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          add(1);
        }}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="歌名"
          className="min-w-0 flex-1 rounded-lg border border-classroom-border px-3 py-2 text-lg text-text-primary outline-none focus:border-accent"
        />
        <button type="submit" className="rounded-lg bg-accent px-3 py-2 font-semibold text-white">
          加入
        </button>
      </form>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => add(3)}
          className="rounded-lg border border-classroom-border px-3 py-2 text-sm text-text-primary"
        >
          加入 3 次
        </button>
        <button
          type="button"
          onClick={pick}
          className="rounded-lg border border-classroom-border px-3 py-2 text-sm text-text-primary"
        >
          抽一首
        </button>
      </div>
      <p className="mt-2 h-5 text-sm text-text-secondary">{picked}</p>
    </div>
  );
}
