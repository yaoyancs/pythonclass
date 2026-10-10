import { trackRun } from '../../analytics/client';
import { useCallback, useEffect, useState } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { canRun } from '../../engine/sceneTransitions';
import { usePythonEngine } from '../../python/usePythonEngine';
import { Button } from '../ui/Button';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { EngineStatus } from './EngineStatus';
import { InputPrompt } from './InputPrompt';
import { useExecTrace } from '../stage/BranchContestStage';

export function PythonPlayground({ embedded = false }: { embedded?: boolean }) {
  const { state, dispatch, scene } = useSceneEngine();
  const { isReady, runCode } = usePythonEngine();
  const [inputPrompt, setInputPrompt] = useState<{ prompt: string; runId?: string } | null>(null);
  const [pendingRun, setPendingRun] = useState<{ code: string; resolve: (v: string) => void } | null>(
    null,
  );

  const runEnabled = canRun(scene, state, isReady);
  const trace = useExecTrace();
  const mode = scene.content.branchContest?.mode;
  const tracing = mode === 'trace' || mode === 'lab' || mode === 'extend';
  const hideRun = mode === 'trace' || mode === 'lab';

  const handleRun = useCallback(async () => {
    if (!runEnabled) return;
    dispatch({ type: 'RUN_START' });
    trackRun(state.lessonId, state.currentSceneIndex);

    const onInput = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        setInputPrompt({ prompt });
        setPendingRun({ code: state.sceneLocal.code, resolve });
      });
    };

    try {
      const result = await runCode(state.sceneLocal.code, onInput);
      dispatch({ type: 'RUN_COMPLETE', result });
    } catch {
      dispatch({
        type: 'RUN_COMPLETE',
        result: {
          stdout: '',
          stderr: '',
          error: { type: 'Error', message: 'Execution interrupted' },
        },
      });
    } finally {
      setInputPrompt(null);
      setPendingRun(null);
    }
  }, [runEnabled, dispatch, runCode, state.sceneLocal.code]);

  const handleInputSubmit = (value: string) => {
    pendingRun?.resolve(value);
    setInputPrompt(null);
  };

  useEffect(() => {
    (window as unknown as { __pyclassRun?: () => void }).__pyclassRun = handleRun;
    return () => {
      delete (window as unknown as { __pyclassRun?: () => void }).__pyclassRun;
    };
  }, [handleRun]);

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
  const hideEditorHeading = state.lessonId === 'lesson03' || state.lessonId === 'branch-contest';

  return (
    <section className={embedded ? 'flex h-full min-h-0 flex-col overflow-hidden' : 'grid h-full place-items-center overflow-hidden px-10 py-10'}>
      {/* 卡片包裹内容并垂直居中，代码少时不被拉伸成大片空白 */}
      <div className={`flex w-full flex-col gap-5 overflow-y-auto rounded-3xl bg-classroom-stage shadow-card ${embedded ? 'h-full min-h-0 p-5' : 'max-h-full p-7'}`}>
        <div className={`flex items-center ${hideEditorHeading ? 'justify-end' : 'justify-between'}`}>
          {!hideEditorHeading && (
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-text-secondary">
              代码练习区
            </h3>
          )}
          <EngineStatus />
        </div>

        <CodeEditor
          activeLine={tracing ? trace.line : undefined}
          lineNote={tracing ? trace.note : undefined}
          fontSize={24}
          fluo={scene.content.branchContest?.mode === 'lab'}
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
                <Button variant="secondary" size="lg" onClick={() => dispatch({ type: 'RESET_CODE' })}>
                  重置
                </Button>
              )}
              {locked && (
                <p className="max-w-40 text-base text-highlight">请先完成预测并提交，再运行验证。</p>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <OutputPanel />
            </div>
          </div>
        )}
      </div>

      {inputPrompt && (
        <InputPrompt prompt={inputPrompt.prompt} onSubmit={handleInputSubmit} />
      )}
    </section>
  );
}
