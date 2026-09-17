import { useEffect, useMemo, useState } from 'react';
import type { BigDataPathContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface BigDataPathStageProps {
  content: BigDataPathContent;
  sceneId: string;
}

const CHART_MS = 10000;

export function BigDataPathStage({ content, sceneId }: BigDataPathStageProps) {
  // 0..n-1 路径逐段；n 开始播柱状图；n+1 桥接语
  const stepCount = content.steps.length;
  const maxPhase = stepCount + 1;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const stepsVisible = Math.min(phase + 1, stepCount);
  const showChart = phase >= stepCount;
  const showQuote = phase >= stepCount + 1;

  const [chartProgress, setChartProgress] = useState(0);
  const maxValue = useMemo(
    () => Math.max(...content.chartBars.map((b) => b.value), 1),
    [content.chartBars],
  );

  useEffect(() => {
    if (!showChart) {
      setChartProgress(0);
      return;
    }
    setChartProgress(0);
    const started = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / CHART_MS);
      // 前 2s 读数感，后 8s 柱子长高
      const eased = t < 0.2 ? t * 0.15 : 0.03 + ((t - 0.2) / 0.8) ** 0.7 * 0.97;
      setChartProgress(Math.min(1, eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showChart, sceneId]);

  const reading = showChart && chartProgress < 0.12;

  return (
    <div
      className="mt-3 cursor-pointer select-none"
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
      <div className="grid grid-cols-[14rem_1fr] gap-6 items-start">
        <div className="flex flex-col items-start">
          {content.steps.slice(0, stepsVisible).map((step, i) => {
            const isNewest = i === stepsVisible - 1;
            return (
              <div key={step} className="w-full">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-lg shadow-card ${
                    isNewest ? 'timeline-node-in bg-accent text-white' : 'bg-classroom-stage text-text-primary'
                  }`}
                >
                  {step}
                </div>
                {i < stepsVisible - 1 && (
                  <div className="pl-6 py-0.5 text-accent text-lg leading-none">↓</div>
                )}
                {i === stepsVisible - 1 && i < stepCount - 1 && (
                  <div className="pl-6 py-0.5 text-accent/40 text-lg leading-none">↓</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="min-h-[22rem]">
          {showChart ? (
            <div className="rounded-3xl bg-classroom-stage shadow-card px-5 py-4 h-full timeline-node-in">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <p className="title-kai text-xl text-text-primary">{content.chartTitle}</p>
                <p className="text-sm text-text-secondary">
                  {reading ? '读取校园消费数据…' : '生成柱状图'}
                </p>
              </div>

              {reading ? (
                <div className="font-mono text-sm text-text-secondary space-y-1.5 py-6">
                  <div className="stage-fade-in">canteen,amount</div>
                  <div className="stage-fade-in" style={{ animationDelay: '80ms' }}>
                    一食堂,12840
                  </div>
                  <div className="stage-fade-in" style={{ animationDelay: '160ms' }}>
                    二食堂,9650
                  </div>
                  <div className="stage-fade-in" style={{ animationDelay: '240ms' }}>
                    超市,7420
                  </div>
                  <div className="stage-fade-in" style={{ animationDelay: '320ms' }}>
                    …
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-4 h-64 pt-4 pb-2 border-b border-classroom-border">
                  {content.chartBars.map((bar) => {
                    const h = `${Math.max(6, (bar.value / maxValue) * chartProgress * 100)}%`;
                    return (
                      <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-sm text-accent tabular-nums">
                          {Math.round(bar.value * chartProgress)}
                        </span>
                        <div
                          className="w-full max-w-[3.5rem] rounded-t-xl bg-accent transition-[height] duration-150 ease-out"
                          style={{ height: h }}
                        />
                        <span className="text-sm text-text-secondary text-center leading-tight">
                          {bar.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-classroom-border h-full grid place-items-center px-6">
              <p className="text-lg text-text-secondary text-center leading-relaxed">
                路径点亮后，右侧将演示：
                <br />
                读取校园消费数据 → 生成柱状图
              </p>
            </div>
          )}
        </div>
      </div>

      {showQuote && (
        <blockquote className="mt-5 rounded-3xl bg-accent-muted px-6 py-4 timeline-node-in">
          <p className="title-kai text-lg md:text-xl text-text-primary leading-relaxed">
            “{content.bridgeQuote}”
          </p>
        </blockquote>
      )}

      {!done && (
        <p className="mt-4 text-base text-accent/80">
          {stepsVisible < stepCount
            ? `点击继续 · 路径 ${stepsVisible}/${stepCount}`
            : showChart && !showQuote
              ? '点击继续 · 看今天与以后的联系'
              : '点击继续 · 或按空格 / →'}
        </p>
      )}
    </div>
  );
}
