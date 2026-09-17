import { useState } from 'react';
import type { AiLiveCodeContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: AiLiveCodeContent;
  sceneId: string;
}

/**
 * 课堂演示：可接免费大模型 API（VITE_LLM_*），失败则用讲义预设代码。
 */
export function AiLiveCodeStage({ content, sceneId }: Props) {
  const { phase, advance, done } = useStageAdvance(sceneId, 2);
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'api' | 'preset' | null>(null);

  const ask = async () => {
    if (loading || reply) return;
    setLoading(true);
    const base = import.meta.env.VITE_LLM_BASE_URL as string | undefined;
    const key = import.meta.env.VITE_LLM_API_KEY as string | undefined;
    const model = (import.meta.env.VITE_LLM_MODEL as string | undefined) || 'gpt-4o-mini';

    try {
      if (base && key) {
        const res = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: '你是编程助教。只输出完整可运行的 Python 代码，不要解释。',
              },
              { role: 'user', content: content.prompt },
            ],
            temperature: 0.2,
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) throw new Error('empty');
        setReply(text.replace(/^```python\n?|```$/g, '').trim());
        setSource('api');
      } else {
        throw new Error('no key');
      }
    } catch {
      setReply(content.presetReply);
      setSource('preset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 select-none">
      <div className="rounded-3xl bg-classroom-stage shadow-card px-6 py-5">
        <p className="text-sm tracking-[0.18em] text-accent mb-2">向 AI 提问</p>
        <p className="title-kai text-xl text-text-primary leading-relaxed">{content.prompt}</p>
        <button
          type="button"
          onClick={ask}
          disabled={loading || Boolean(reply)}
          className="mt-4 rounded-full bg-accent text-white px-5 py-2 text-lg disabled:opacity-50"
        >
          {loading ? '生成中…' : reply ? '已生成' : '现场生成'}
        </button>
        {source && (
          <span className="ml-3 text-sm text-text-secondary">
            {source === 'api' ? '来自 API' : '讲义预设（可配置 VITE_LLM_*）'}
          </span>
        )}
      </div>

      {reply && (
        <pre className="mt-5 rounded-3xl bg-code-bg shadow-card px-6 py-5 font-mono text-base text-code-text whitespace-pre-wrap timeline-node-in">
          {reply}
        </pre>
      )}

      <div
        className="mt-5 cursor-pointer"
        onClick={() => reply && advance()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && reply && advance()) e.preventDefault();
        }}
      >
        {phase >= 1 && (
          <p className="title-kai text-xl text-text-primary timeline-node-in">
            “{content.admitLine}”
          </p>
        )}
        {phase >= 2 && (
          <p className="mt-4 stage-emphasis text-2xl timeline-node-in">
            {content.challengeQuestion}
          </p>
        )}
        {reply && !done && (
          <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>
        )}
      </div>
    </div>
  );
}
