import { useState } from 'react';

const INITIAL: Record<string, number> = { 晴天: 12, 稻香: 30, 夜曲: 7 };
const INITIAL_AVAILABLE = ['晴天', '稻香', '夜曲', '青花瓷'];
const SUGGESTIONS = [...INITIAL_AVAILABLE, '七里香', '后来', '东风破'];

function normalizeSong(value: string) {
  return value.trim().replace(/^《|》$/g, '').trim();
}

/** 班级点歌榜：用字典累计推荐次数，用集合判断曲库是否已有歌曲。 */
export function PlayCountsStage() {
  const [plays, setPlays] = useState<Record<string, number>>({ ...INITIAL });
  const [available, setAvailable] = useState(() => new Set(INITIAL_AVAILABLE));
  const [song, setSong] = useState('');
  const [status, setStatus] = useState('输入歌名，为它增加 1 次推荐');
  const [lastRecommendation, setLastRecommendation] = useState<string | null>(null);
  const ranking = Object.entries(plays).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
  const total = ranking.reduce((sum, [, n]) => sum + n, 0);
  const topCount = ranking[0]?.[1] ?? 0;
  const topSongs = ranking.filter(([, n]) => n === topCount).map(([name]) => name);
  const playable = ranking.map(([name]) => name).filter((name) => available.has(name));
  const missing = ranking.map(([name]) => name).filter((name) => !available.has(name));

  const recommend = (selectedSong = song) => {
    const name = normalizeSong(selectedSong);
    if (!name) {
      setStatus('请先填写歌名');
      return;
    }
    setPlays((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
    setLastRecommendation(name);
    setSong('');
    setStatus(`${name} +1，可撤销`);
  };

  const undo = () => {
    if (!lastRecommendation) return;
    const name = lastRecommendation;
    setPlays((prev) => {
      const next = { ...prev };
      if (next[name] <= 1) delete next[name];
      else next[name] -= 1;
      return next;
    });
    setLastRecommendation(null);
    setStatus(`已撤销对 ${name} 的推荐`);
  };

  const addToLibrary = (name: string) => {
    setAvailable((prev) => new Set([...prev, name]));
    setStatus(`${name} 已加入曲库，可以播放`);
  };

  const reset = () => {
    setPlays({ ...INITIAL });
    setAvailable(new Set(INITIAL_AVAILABLE));
    setSong('');
    setLastRecommendation(null);
    setStatus('已恢复演示数据');
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-classroom-border bg-classroom-stage p-4 shadow-card">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-xl font-semibold text-text-primary">班级点歌榜</p>
          <p className="text-sm text-text-secondary">晚会筹备 · 实时统计推荐</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-accent">{total}</p>
          <p className="text-xs text-text-secondary">累计推荐</p>
        </div>
      </div>
      <div className="mb-3 rounded-xl bg-code-bg px-4 py-3">
        {ranking.map(([name, n], index) => (
          <button
            key={name}
            type="button"
            onClick={() => recommend(name)}
            title={`推荐《${name}》`}
            className="flex w-full items-center gap-3 rounded-md px-1 py-1.5 text-left hover:bg-white/10"
          >
            <span className="w-5 text-sm text-code-muted">{index + 1}</span>
            <span className="flex-1 font-medium text-code-text">{name}</span>
            <span className="font-mono text-lg font-semibold text-highlight">{n}</span>
            <span className="text-xs text-code-muted">+1</span>
          </button>
        ))}
      </div>
      <form className="mb-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); recommend(); }}>
        <input
          value={song}
          onChange={(e) => setSong(e.target.value)}
          list="song-suggestions"
          placeholder="输入想推荐的歌"
          className="min-w-0 flex-1 rounded-lg border border-classroom-border bg-white px-3 py-2 text-lg text-text-primary outline-none focus:border-accent"
        />
        <datalist id="song-suggestions">
          {SUGGESTIONS.map((name) => <option key={name} value={name} />)}
        </datalist>
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 font-semibold text-white">
          推荐 +1
        </button>
      </form>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-success/10 px-3 py-2">
          <p className="font-semibold text-text-primary">✓ 曲库可播放</p>
          <p className="mt-1 text-text-secondary">{playable.join('、') || '暂无'}</p>
        </div>
        <div className="rounded-lg bg-highlight/10 px-3 py-2">
          <p className="font-semibold text-text-primary">＋ 需要补充</p>
          {missing.length ? (
            <div className="mt-1 flex flex-wrap gap-1">
              {missing.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => addToLibrary(name)}
                  className="rounded bg-highlight/20 px-1.5 py-0.5 text-text-primary"
                  title="点击加入曲库"
                >
                  {name} ＋
                </button>
              ))}
            </div>
          ) : <p className="mt-1 text-text-secondary">暂无</p>}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
        <p className="min-w-0 flex-1 truncate">
          热门：<span className="font-semibold text-text-primary">{topSongs.join('、') || '暂无'}</span>
          <span className="ml-2">· {status}</span>
        </p>
        <button type="button" onClick={undo} disabled={!lastRecommendation} className="disabled:opacity-30">
          撤销
        </button>
        <button type="button" onClick={reset}>重置</button>
      </div>
    </div>
  );
}
