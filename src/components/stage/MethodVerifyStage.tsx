import { useState } from 'react';
import type { MethodVerifyContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: MethodVerifyContent;
  sceneId: string;
}

/**
 * 巩固「AI 时代学习方式」：提示词 → AI 代码 → 承认正确 → 逐问接管 → 总结。
 * 分步推进，避免一屏塞满。
 */
export function MethodVerifyStage({ content, sceneId }: Props) {
  // phase: 0=仅代码；1=承认句；2..=问题逐条；最后=总结
  const maxPhase = content.questions.length + 2;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);
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

  const showAdmit = phase >= 1;
  const qVisible = Math.min(Math.max(phase - 1, 0), content.questions.length);
  const showSummary = phase >= content.questions.length + 2;

  return (
    <div className="mt-4 select-none">
      <div className="rounded-3xl bg-classroom-stage shadow-card px-6 py-5">
        <p className="text-sm tracking-[0.18em] text-accent mb-2">提示词</p>
        <p className="title-kai text-xl text-text-primary leading-relaxed">{content.prompt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={ask}
            disabled={loading || Boolean(reply)}
            className="rounded-full bg-accent text-white px-5 py-2 text-lg disabled:opacity-50"
          >
            {loading ? '生成中…' : reply ? '已生成' : '展示 AI 可能生成的代码'}
          </button>
          {source && (
            <span className="text-sm text-text-secondary">
              {source === 'api' ? '来自 API' : '讲义预设'}
            </span>
          )}
        </div>
      </div>

      {reply && (
        <div className="mt-5 grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-6 items-start">
          <div
            className="cursor-pointer"
            onClick={() => advance()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && advance()) e.preventDefault();
            }}
          >
            {showAdmit && (
              <p className="title-kai text-xl text-text-primary leading-relaxed timeline-node-in border-l-[6px] border-accent pl-5">
                {content.admitLine}
              </p>
            )}

            {qVisible > 0 && (
              <ol className="mt-5 space-y-3">
                {content.questions.slice(0, qVisible).map((q, i) => (
                  <li
                    key={q}
                    className="rounded-2xl bg-classroom-stage shadow-card px-5 py-3 text-lg timeline-node-in flex gap-3"
                  >
                    <span className="text-accent tabular-nums shrink-0">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            )}

            {showSummary && (
              <div className="mt-5 rounded-3xl bg-accent-muted px-6 py-5 timeline-node-in">
                <p className="text-sm tracking-[0.18em] text-accent mb-2">总结</p>
                <p className="title-kai text-xl text-text-primary leading-relaxed">
                  {content.summary}
                </p>
              </div>
            )}

            {!done && (
              <p className="mt-5 text-base text-accent/80">
                {showAdmit
                  ? '点击继续 · 问题逐个出现'
                  : '点击继续 · 先看清这段代码'}
              </p>
            )}
          </div>

          <pre className="rounded-3xl bg-code-bg shadow-card px-5 py-4 font-mono text-[0.95rem] leading-relaxed text-code-text whitespace-pre-wrap timeline-node-in sticky top-0">
            <p className="text-xs tracking-[0.16em] text-code-muted mb-3 font-sans">
              AI 可能生成
            </p>
            {reply}
          </pre>
        </div>
      )}
    </div>
  );
}
