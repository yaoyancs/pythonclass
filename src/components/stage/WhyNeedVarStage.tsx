import { useEffect } from 'react';
import type { WhyNeedVarContent } from '../../types/scene';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: WhyNeedVarContent;
  sceneId: string;
}

export function WhyNeedVarStage({ content, sceneId }: Props) {
  const { scene, state, dispatch } = useSceneEngine();
  const hasEditor = Boolean(scene.code);
  // 有代码区时问题直接列出，不显示旁白；否则 0 bare → 逐条问题 → 标签 → 有名字的写法 → 旁白 → 小结
  const stepsAfterQuestions = hasEditor ? 0 : content.questions.length;
  const teacherStep = hasEditor ? 0 : 1;
  const maxPhase = stepsAfterQuestions + 3 + teacherStep;
  const { phase, advance, done } = useStageAdvance(sceneId, maxPhase);

  const qVisible = hasEditor ? content.questions.length : Math.min(phase, content.questions.length);
  const showLabels = phase >= stepsAfterQuestions + 1;
  const showCode = phase >= stepsAfterQuestions + 2;
  const showTeacher = !hasEditor && phase >= stepsAfterQuestions + 3;
  const showSummary = phase >= stepsAfterQuestions + 2 + teacherStep + 1;
  const keepLeftBeats = !showCode || hasEditor;

  useEffect(() => {
    if (!hasEditor || !showCode) return;
    if (state.sceneLocal.code !== content.bareCode) return;
    dispatch({ type: 'UPDATE_CODE', code: content.namedCode });
  }, [hasEditor, showCode, state.sceneLocal.code, content.bareCode, content.namedCode, dispatch]);

  return (
    <div
      className="mt-4 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && advance()) e.preventDefault();
      }}
    >
      {!hasEditor && !showCode && (
        <div className="rounded-3xl bg-code-bg shadow-card px-6 py-5 font-mono text-2xl text-code-text">
          {content.bareCode}
        </div>
      )}

      {qVisible > 0 && keepLeftBeats && (
        <ul className="mt-5 space-y-2">
          {content.questions.slice(0, qVisible).map((p) => (
            <li key={p} className="stage-emphasis text-xl timeline-node-in">
              {p}
            </li>
          ))}
        </ul>
      )}

      {showLabels && keepLeftBeats && (
        <div className="mt-8 flex justify-center gap-10 timeline-node-in">
          {content.numbers.map((n) => (
            <div key={n.value} className="text-center">
              <div className="font-mono text-3xl text-text-primary mb-2">{n.value}</div>
              <div className="text-accent text-xl">↓</div>
              <div className="mt-2 rounded-full bg-accent text-white px-4 py-1.5 title-kai text-lg">
                {n.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCode && !hasEditor && (
        <pre className="rounded-3xl bg-code-bg shadow-card px-6 py-5 font-mono text-lg text-code-text whitespace-pre-wrap timeline-node-in">
          {content.namedCode}
        </pre>
      )}

      {showTeacher && (
        <div className="mt-5 space-y-2 timeline-node-in">
          {content.teacherLines.map((line) => (
            <p key={line} className="title-kai text-xl text-text-primary leading-relaxed">
              “{line}”
            </p>
          ))}
        </div>
      )}

      {showSummary && (
        <p className="mt-5 rounded-3xl bg-accent-muted px-6 py-4 title-kai text-xl text-text-primary timeline-node-in">
          {content.summary}
        </p>
      )}

      {!done && <p className="mt-5 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
