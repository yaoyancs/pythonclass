import { useState } from 'react';

const INITIAL: Record<string, number> = { 晴天: 12, 稻香: 30, 夜曲: 7 };
const OTHER = new Set(["稻香", "七里香"]);

/** 与 demos/play_counts.py 同一套操作：items、赋值、get、pop，以及 set(plays) & other。 */
export function PlayCountsStage() {
  const [plays, setPlays] = useState<Record<string, number>>({ ...INITIAL });
  const [song, setSong] = useState('');
  const [count, setCount] = useState('1');
  const [status, setStatus] = useState('');

  const lines = Object.entries(plays).map(([name, n]) => `${name}  ${n}`);

  const save = () => {
    const name = song.trim();
    if (!name) {
      setStatus('请先填写歌名');
      return;
    }
    const n = Number(count);
    if (!Number.isInteger(n)) {
      setStatus('次数要是整数');
      return;
    }
    setPlays((prev) => ({ ...prev, [name]: n }));
    setStatus('已保存');
  };

  const query = () => {
    const name = song.trim();
    setStatus(name in plays ? String(plays[name]) : '查无此人');
  };

  const remove = () => {
    const name = song.trim();
    if (!(name in plays)) {
      setStatus('查无此人');
      return;
    }
    setPlays((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setStatus('已删除');
  };

  const common = () => {
    const both = Object.keys(plays).filter((name) => OTHER.has(name)).sort();
    setStatus(both.length ? both.join(' ') : '没有共同听过');
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-classroom-border bg-classroom-stage p-4 shadow-card">
      <p className="mb-1 text-center text-lg font-semibold text-text-primary">播放次数</p>
      <p className="mb-3 text-center text-sm text-text-secondary">另一位听过：稻香、七里香</p>
      <pre className="mb-3 min-h-36 rounded-lg bg-code-bg px-4 py-3 font-mono text-xl leading-relaxed text-code-text">
        {lines.join('\n') || '（空）'}
      </pre>
      <input
        value={song}
        onChange={(e) => setSong(e.target.value)}
        placeholder="歌名，例如 晴天"
        className="mb-2 w-full rounded-lg border border-classroom-border px-3 py-2 font-mono text-lg text-text-primary outline-none focus:border-accent"
      />
      <input
        value={count}
        onChange={(e) => setCount(e.target.value)}
        placeholder="次数"
        className="mb-3 w-full rounded-lg border border-classroom-border px-3 py-2 font-mono text-lg text-text-primary outline-none focus:border-accent"
      />
      <div className="grid grid-cols-2 gap-2">
        {[
          ['查看全部', () => setStatus(lines.join('  ') || '（空）')],
          ['录入/修改', save],
          ['查询', query],
          ['删除', remove],
          ['共同听过', common],
        ].map(([label, action]) => (
          <button
            key={label as string}
            type="button"
            onClick={action as () => void}
            className="rounded-lg bg-accent px-3 py-2 text-base font-medium text-white"
          >
            {label as string}
          </button>
        ))}
      </div>
      <p className="mt-3 min-h-7 text-center font-mono text-lg text-text-primary">{status}</p>
    </div>
  );
}
