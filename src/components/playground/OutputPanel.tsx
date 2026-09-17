import { useSceneEngine } from '../../engine/SceneEngine';

export function OutputPanel() {
  const { state } = useSceneEngine();
  const output = state.sceneLocal.lastOutput;

  if (!output) {
    return (
      <div className="shrink-0 min-h-[128px] rounded-2xl bg-code-bg p-5">
        <p className="text-code-muted text-sm uppercase tracking-[0.18em] mb-2">输出</p>
        <p className="text-code-muted italic">运行代码后，输出将显示在这里</p>
      </div>
    );
  }

  const hasError = !!output.error;

  return (
    <div className="shrink-0 min-h-[128px] rounded-2xl bg-code-bg p-5 space-y-3">
      <p className="text-code-muted text-sm uppercase tracking-[0.18em]">输出</p>

      {output.stdout && (
        <pre className="font-mono text-xl text-code-text whitespace-pre-wrap">{output.stdout}</pre>
      )}

      {output.stderr && !hasError && (
        <pre className="font-mono text-base text-code-muted whitespace-pre-wrap">
          {output.stderr}
        </pre>
      )}

      {hasError && output.error && (
        <div className="rounded-lg border border-code-error/50 bg-code-error/10 p-4">
          <p className="text-code-error font-semibold text-lg">{output.error.type}</p>
          <pre className="font-mono text-base text-code-error/90 mt-2 whitespace-pre-wrap">
            {output.error.message}
          </pre>
        </div>
      )}
    </div>
  );
}
