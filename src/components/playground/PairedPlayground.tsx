import { useEffect, useState } from 'react';
import Editor, { type BeforeMount } from '@monaco-editor/react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { usePythonEngine } from '../../python/usePythonEngine';
import { Button } from '../ui/Button';
import type { PythonResult } from '../../types/python';

const defineTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme('classroom', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#12211c',
      'editor.lineHighlightBackground': '#1a2f27',
      'editorLineNumber.foreground': '#4f7267',
      'editorLineNumber.activeForeground': '#9ab5a8',
      'editorCursor.foreground': '#5eead4',
      'editor.selectionBackground': '#2c453c',
    },
  });
};

/** 与左侧 PythonPlayground 并列时保持同宽同高。 */
const PAIRED_EDITOR_HEIGHT = 520;

export function PairedPlayground() {
  const { scene } = useSceneEngine();
  const paired = scene.pairedCode;
  const { isReady, runCode } = usePythonEngine();
  const [code, setCode] = useState(paired?.initial ?? '');
  const [output, setOutput] = useState<PythonResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setCode(paired?.initial ?? '');
    setOutput(null);
  }, [scene.id, paired?.initial]);

  if (!paired) return null;

  const run = async () => {
    if (!isReady || running) return;
    setRunning(true);
    try {
      setOutput(await runCode(code));
    } finally {
      setRunning(false);
    }
  };

  const errorText = output?.error ? output.stderr || output.error.message : '';

  return (
    <section className="grid h-full place-items-center overflow-hidden px-10 py-10">
      <div className="flex max-h-full w-full flex-col gap-5 overflow-y-auto rounded-3xl bg-classroom-stage p-7 shadow-card">
        <h3 className="text-xl font-semibold text-text-primary">{paired.label}</h3>
        <div className="shrink-0 overflow-hidden rounded-2xl bg-code-bg" style={{ height: PAIRED_EDITOR_HEIGHT }}>
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="classroom"
            beforeMount={defineTheme}
            value={code}
            onChange={(value) => setCode(value ?? '')}
            options={{
              fontSize: 24,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 18, bottom: 18 },
              wordWrap: 'on',
              tabSize: 4,
              scrollbar: { horizontalScrollbarSize: 8, verticalScrollbarSize: 8 },
            }}
          />
        </div>
        <div className="flex items-stretch gap-3">
          <div className="flex shrink-0 flex-col gap-3">
            <Button variant="primary" size="lg" disabled={!isReady || running} onClick={run}>
              {running ? '运行中…' : '运行'}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => { setCode(paired.initial); setOutput(null); }}>
              重置
            </Button>
          </div>
          <div className="min-h-[128px] min-w-0 flex-1 rounded-2xl bg-code-bg p-5">
            <p className="mb-2 text-sm uppercase tracking-[0.18em] text-code-muted">输出</p>
            {output?.stdout && <pre className="whitespace-pre-wrap font-mono text-xl text-code-text">{output.stdout}</pre>}
            {errorText && <pre className="whitespace-pre-wrap font-mono text-base text-code-error">{errorText}</pre>}
            {!output && <p className="italic text-code-muted">运行代码后，输出将显示在这里</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
