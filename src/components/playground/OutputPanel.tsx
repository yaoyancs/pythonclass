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
  const errorText = output.error ? output.stderr || output.error.message : '';

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

      {hasError && errorText && (
        <pre className="font-mono text-base text-code-error whitespace-pre-wrap">{errorText}</pre>
      )}
    </div>
  );
}
