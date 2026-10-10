import { useEffect, useRef, useState } from 'react';
import Editor, { type BeforeMount, type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useSceneEngine } from '../../engine/SceneEngine';

interface CodeEditorProps {
  onFocusChange?: (focused: boolean) => void;
  /** 占满父容器，而不是按行数收缩 */
  fill?: boolean;
  readOnly?: boolean;
  /** 1-based */
  activeLine?: number;
  lineNote?: string;
  fontSize?: number;
  /** 实验页当前行用荧光高亮。 */
  fluo?: boolean;
  /** 第 8 页小结：代码整段用黄色。 */
  yellow?: boolean;
}

// 让编辑器底色与输出区一致，避免深色块之间色调不统一
const defineTheme: BeforeMount = (monaco) => {
  const colors = {
    'editor.background': '#12211c',
    'editor.lineHighlightBackground': '#1a2f27',
    'editorLineNumber.foreground': '#4f7267',
    'editorLineNumber.activeForeground': '#9ab5a8',
    'editorCursor.foreground': '#5eead4',
    'editor.selectionBackground': '#2c453c',
    'editorIndentGuide.background1': '#233a32',
  };
  monaco.editor.defineTheme('classroom', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors,
  });
  const yellow = 'FDE047';
  monaco.editor.defineTheme('classroom-yellow', {
    base: 'vs-dark',
    inherit: true,
    rules: ['', 'keyword', 'string', 'number', 'comment', 'identifier', 'delimiter', 'operator'].map((token) => ({
      token,
      foreground: yellow,
    })),
    colors: { ...colors, 'editor.foreground': '#FDE047' },
  });
};

export function CodeEditor({
  onFocusChange,
  fill = false,
  readOnly = false,
  activeLine,
  lineNote,
  fontSize = 24,
  fluo = false,
  yellow = false,
}: CodeEditorProps) {
  const { state, scene, dispatch } = useSceneEngine();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const [height, setHeight] = useState(220);
  const code = state.sceneLocal.code;
  const codeRef = useRef(code);
  codeRef.current = code;

  const handleMount: OnMount = (ed, monaco) => {
    editorRef.current = ed;
    monacoRef.current = monaco;
    // 高度跟随代码行数，避免几行代码占满整块区域
    const syncHeight = () => {
      setHeight(Math.min(Math.max(ed.getContentHeight() + 36, 160), 620));
    };
    syncHeight();
    ed.updateOptions({ readOnly, domReadOnly: readOnly });
    ed.onDidContentSizeChange(syncHeight);
    ed.onDidFocusEditorText(() => onFocusChange?.(true));
    ed.onDidBlurEditorText(() => onFocusChange?.(false));
  };

  useEffect(() => {
    const editor = editorRef.current;
    editor?.updateOptions({ readOnly, domReadOnly: readOnly, fontSize });
    if (editor && editor.getValue() !== code) {
      editor.setValue(code);
    }
  }, [scene.id, code, readOnly, fontSize]);

  useEffect(() => {
    const ed = editorRef.current;
    const monaco = monacoRef.current;
    if (!ed || !monaco) return;
    decorationsRef.current?.clear();
    if (!activeLine) return;
    decorationsRef.current = ed.createDecorationsCollection([
      {
        range: new monaco.Range(activeLine, 1, activeLine, 1),
        options: {
          isWholeLine: true,
          className: fluo ? 'exec-current-line-fluo' : 'exec-current-line',
          after: lineNote
            ? { content: `    ${lineNote}`, inlineClassName: fluo ? 'exec-line-note-fluo' : 'exec-line-note' }
            : undefined,
        },
      },
    ]);
    ed.revealLineInCenter(activeLine);
  }, [activeLine, lineNote, fluo]);

  return (
    <div
      className={`overflow-hidden bg-code-bg ${fill ? 'min-h-0 flex-1' : 'shrink-0 rounded-2xl'}`}
      style={fill ? undefined : { height: `${height}px` }}
    >
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        theme={yellow ? 'classroom-yellow' : 'classroom'}
        beforeMount={defineTheme}
        onMount={handleMount}
        onChange={(value) => {
          if (value === undefined || value === codeRef.current) return;
          dispatch({ type: 'UPDATE_CODE', code: value });
        }}
        options={{
          fontSize,
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          readOnly,
          padding: { top: 18, bottom: 18 },
          wordWrap: 'on',
          tabSize: 4,
          renderLineHighlight: 'line',
          overviewRulerLanes: 0,
          scrollbar: { horizontalScrollbarSize: 8, verticalScrollbarSize: 8 },
        }}
      />
    </div>
  );
}
