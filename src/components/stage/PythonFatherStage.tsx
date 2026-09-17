import { useCallback, useRef, useState } from 'react';
import type { PythonFatherContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface PythonFatherStageProps {
  content: PythonFatherContent;
  sceneId: string;
}

/** 人像 + 点击逐条揭开趣事；名称趣事旁可点播不同读音 */
export function PythonFatherStage({ content, sceneId }: PythonFatherStageProps) {
  const hasClosing = Boolean(content.closing);
  // phase: 0=肖像；1..n=趣事；可选 closing
  const maxPhase = content.anecdotes.length + (hasClosing ? 1 : 0);
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const anecdotesVisible = Math.min(phase, content.anecdotes.length);
  const showClosing = hasClosing && phase >= content.anecdotes.length + 1;
  const showPronunciations =
    Boolean(content.pronunciations?.length) && anecdotesVisible >= 1;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);

  const playClip = useCallback((src: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingSrc(src);
    audio.onended = () => setPlayingSrc((cur) => (cur === src ? null : cur));
    audio.onerror = () => setPlayingSrc((cur) => (cur === src ? null : cur));
    void audio.play().catch(() => setPlayingSrc(null));
  }, []);

  return (
    <div
      className="mt-6 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advance();
        }
      }}
    >
      <div className="grid grid-cols-[minmax(12rem,0.85fr)_minmax(0,1.15fr)] gap-10 items-start">
        <figure className="pyhist-portrait-in justify-self-center">
          <img
            src={content.portrait.src}
            alt={content.portrait.alt}
            className="max-h-[22rem] w-auto rounded-3xl bg-classroom-stage shadow-card object-cover rotate-[-1.5deg]"
          />
          {content.portrait.caption && (
            <figcaption className="mt-4 text-center text-lg text-text-secondary">
              {content.portrait.caption}
            </figcaption>
          )}
        </figure>

        <div className="space-y-4 min-h-[16rem]">
          {content.anecdotes.slice(0, anecdotesVisible).map((item, i) => {
            const isNewest = i === anecdotesVisible - 1;
            const isNameCard = i === 0;
            return (
              <div
                key={item.title}
                className={`rounded-3xl bg-classroom-stage shadow-card px-6 py-5 ${
                  isNewest ? 'pyhist-card-in' : ''
                }`}
              >
                <p className="text-sm tracking-[0.18em] text-accent mb-2">{item.title}</p>
                <p className="title-kai text-xl text-text-primary leading-relaxed">{item.body}</p>
                <p className="mt-3 text-lg text-text-secondary leading-relaxed">{item.takeaway}</p>

                {isNameCard && showPronunciations && content.pronunciations && (
                  <div
                    className="mt-5 pt-4 border-t border-classroom-border"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <p className="text-sm tracking-[0.18em] text-accent mb-3">
                      {content.pronunciationsHint ?? '听听 Python 怎么读'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {content.pronunciations.map((p) => {
                        const active = playingSrc === p.src;
                        return (
                          <button
                            key={p.src}
                            type="button"
                            className={`rounded-2xl px-4 py-3 text-left transition-colors shadow-card ${
                              active
                                ? 'bg-accent text-white'
                                : 'bg-accent-muted text-text-primary hover:bg-accent/15'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              playClip(p.src);
                            }}
                          >
                            <span className="block text-base font-semibold">
                              {active ? '▶ ' : '♪ '}
                              {p.label}
                            </span>
                            <span
                              className={`block text-sm mt-0.5 ${
                                active ? 'text-white/85' : 'text-text-secondary'
                              }`}
                            >
                              {p.phonetic}
                              {p.note ? ` · ${p.note}` : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {phase === 0 && (
            <p className="text-xl text-text-secondary title-kai leading-relaxed">
              点一下，先认识这位语言的设计者。
            </p>
          )}

          {showClosing && content.closing && (
            <blockquote className="rounded-3xl bg-accent-muted px-6 py-5 pyhist-card-in">
              <p className="title-kai text-xl text-text-primary leading-relaxed">
                “{content.closing}”
              </p>
            </blockquote>
          )}
        </div>
      </div>

      {!done && <p className="mt-6 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
