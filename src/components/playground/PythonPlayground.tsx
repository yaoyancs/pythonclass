import { trackRun, trackRunResult } from '../../analytics/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { canRun } from '../../engine/sceneTransitions';
import { usePythonEngine } from '../../python/usePythonEngine';
import { Button } from '../ui/Button';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { EngineStatus } from './EngineStatus';
import { InputPrompt } from './InputPrompt';
import { useExecTrace } from '../stage/BranchContestStage';
import { useStepCursor } from '../stage/StepRunStage';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import { PredictPanel } from '../stage/PredictPanel';
import { RevealPanel } from '../stage/RevealPanel';

export function PythonPlayground({ embedded = false }: { embedded?: boolean }) {
  const { state, dispatch, scene } = useSceneEngine();
  const { isReady, runCode } = usePythonEngine();
  const [inputPrompt, setInputPrompt] = useState<{ prompt: string; runId?: string } | null>(null);
  const [pendingRun, setPendingRun] = useState<{ code: string; resolve: (v: string) => void } | null>(
    null,
  );

  const trace = useExecTrace();
  const stepLine = useStepCursor(scene.id);
  const evolutionSpec = scene.content.codeEvolution;
  const evolutionSteps = evolutionSpec?.steps ?? [];
  const evolution = useStageAdvance(
    scene.id,
    Math.max(0, evolutionSteps.length - 1),
    evolutionSteps.length > 1,
  );
  const evolutionCode = evolutionSteps[evolution.phase];
  const evolutionLine = evolutionSpec?.focus?.[evolution.phase];
  const evolutionCaption = evolutionSpec?.captions?.[evolution.phase];
  const runEnabled = canRun(scene, state, isReady);
  const mode = scene.content.branchContest?.mode ?? scene.content.conditionPath?.mode;
  const tracing = mode === 'trace' || mode === 'lab' || mode === 'extend' || mode === 'walk';
  const hideRun = Boolean(scene.content.playCountsApp || scene.content.playlistFormApp) || (scene.content.branchContest
    ? mode === 'trace' || mode === 'lab'
    : scene.content.conditionPath?.mode === 'lab' || scene.content.conditionPath?.mode === 'walk');

  const handleRun = useCallback(async () => {
    if (!runEnabled) return;
    dispatch({ type: 'RUN_START' });
    const counted = trackRun(state.lessonId, state.currentSceneIndex);
    const initial = scene.code?.initial ?? '';
    const codeChanged = state.sceneLocal.code.trim() !== initial.trim();

    const onInput = (prompt: string, stdout: string): Promise<string> => {
      dispatch({ type: 'SHOW_OUTPUT', stdout });
      return new Promise((resolve) => {
        setInputPrompt({ prompt });
        setPendingRun({ code: state.sceneLocal.code, resolve });
      });
    };

    try {
      const result = await runCode(state.sceneLocal.code, onInput);
      dispatch({ type: 'RUN_COMPLETE', result });
      if (counted) {
        trackRunResult({
          lessonId: state.lessonId,
          sceneIndex: state.currentSceneIndex,
          sceneId: scene.id,
          partId: scene.partId,
          ok: result.error == null,
          errorType: result.error?.type,
          codeChanged,
        });
      }
    } catch {
      dispatch({
        type: 'RUN_COMPLETE',
        result: {
          stdout: '',
          stderr: '',
          error: { type: 'Error', message: 'Execution interrupted' },
        },
      });
      if (counted) {
        trackRunResult({
          lessonId: state.lessonId,
          sceneIndex: state.currentSceneIndex,
          sceneId: scene.id,
          partId: scene.partId,
          ok: false,
          errorType: 'Error',
          codeChanged,
        });
      }
    } finally {
      setInputPrompt(null);
      setPendingRun(null);
    }
  }, [runEnabled, dispatch, runCode, state.sceneLocal.code, state.lessonId, state.currentSceneIndex, scene]);

  const handleInputSubmit = (value: string) => {
    pendingRun?.resolve(value);
    setInputPrompt(null);
  };

  const outputRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!inputPrompt) return;
    outputRef.current?.scrollIntoView({ block: 'nearest' });
  }, [inputPrompt]);

  useEffect(() => {
    (window as unknown as { __pyclassRun?: () => void }).__pyclassRun = handleRun;
    return () => {
      delete (window as unknown as { __pyclassRun?: () => void }).__pyclassRun;
    };
  }, [handleRun]);

  useEffect(() => {
    if (evolutionCode == null) return;
    dispatch({ type: 'UPDATE_CODE', code: evolutionCode, clearOutput: true });
    // 只在切换演示步骤时替换代码，避免覆盖手动编辑。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, evolution.phase, scene.id]);

  if (!scene.code && scene.layout === 'fullscreen') {
    return null;
  }

  if (!scene.code) {
    return (
      <section className="flex flex-col h-full items-center justify-center px-10 text-text-secondary">
        <EngineStatus />
        <p className="mt-4 text-stage-sub">本 Slide 无需代码编辑器</p>
      </section>
    );
  }

  const locked = (scene.prediction || scene.requiresPrediction) && !state.sceneLocal.predictionSubmitted;
  const hideEditorHeading =
    state.lessonId === 'lesson03' ||
    state.lessonId === 'lesson03-2' ||
    state.lessonId === 'lesson04' ||
    state.lessonId === 'branch-contest';

  return (
    <section className={embedded ? 'flex h-full min-h-0 flex-col overflow-hidden' : 'grid h-full place-items-center overflow-hidden px-10 py-10'}>
      {/* 卡片包裹内容并垂直居中，代码少时不被拉伸成大片空白 */}
      <div className={`flex w-full flex-col rounded-3xl bg-classroom-stage shadow-card ${embedded || inputPrompt ? 'h-full min-h-0 overflow-hidden' : 'max-h-full overflow-y-auto'} ${embedded ? 'p-5' : 'p-7'}`}>
        <div className={`flex min-h-0 flex-col gap-5 ${inputPrompt ? 'flex-1 overflow-y-auto' : ''}`}>
        {scene.pairedCode && (
          <>
            <PredictPanel />
            <RevealPanel />
          </>
        )}
        <div className={`flex items-center ${hideEditorHeading && !scene.pairedCode ? 'justify-end' : 'justify-between'}`}>
          {scene.pairedCode ? (
            <h3 className="text-xl font-semibold text-text-primary">{scene.pairedCode.peerLabel}</h3>
          ) : evolutionSteps.length > 1 ? (
            <p className="text-2xl font-semibold text-text-primary">
              {evolution.phase + 1} / {evolutionSteps.length}
              {evolutionCaption ? <span className="ml-4 font-medium text-accent">{evolutionCaption}</span> : null}
            </p>
          ) : !hideEditorHeading ? (
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-text-secondary">
              代码练习区
            </h3>
          ) : null}
          <EngineStatus />
        </div>

        <CodeEditor
          activeLine={tracing ? trace.line : evolutionLine ?? stepLine ?? scene.content.codeFocusLine}
          lineNote={tracing ? trace.note : undefined}
          fontSize={24}
          heightPx={scene.pairedCode ? 520 : inputPrompt ? 280 : undefined}
          fluo={mode === 'lab'}
          yellow={mode === 'summary'}
          onFocusChange={(focused) => dispatch({ type: 'SET_EDITOR_FOCUSED', value: focused })}
        />

        {mode === 'lab' && trace.prints.length > 0 && (
          <pre className="font-mono text-2xl font-semibold leading-snug text-text-primary">
            {trace.prints.join('\n')}
          </pre>
        )}

        {!hideRun && (
          <div className="flex items-stretch gap-3">
            <div className="flex shrink-0 flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                disabled={!runEnabled}
                onClick={handleRun}
                title={locked ? '请先完成预测' : '运行 (R)'}
              >
                {locked ? '运行（先预测）' : state.isRunning ? '运行中…' : '运行'}
              </Button>
              {scene.code.resetToInitial && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    evolution.reset();
                    dispatch({ type: 'RESET_CODE' });
                  }}
                >
                  重置
                </Button>
              )}
              {locked && (
                <p className="max-w-40 text-base text-highlight">请先完成预测并提交，再运行验证。</p>
              )}
            </div>
            <div ref={outputRef} className="min-w-0 flex-1">
              <OutputPanel />
            </div>
          </div>
        )}
        </div>
        {inputPrompt && (
          <div className="shrink-0 pt-4">
            <InputPrompt prompt={inputPrompt.prompt} onSubmit={handleInputSubmit} />
          </div>
        )}
      </div>
    </section>
  );
}
