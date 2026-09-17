import { useRef, useState } from 'react';
import Editor, { type BeforeMount, type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useSceneEngine } from '../../engine/SceneEngine';

interface CodeEditorProps {
  onFocusChange?: (focused: boolean) => void;
}

// 让编辑器底色与输出区一致，避免深色块之间色调不统一
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
      'editorIndentGuide.background1': '#233a32',
    },
  });
};

export function CodeEditor({ onFocusChange }: CodeEditorProps) {
  const { state, scene, dispatch } = useSceneEngine();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [height, setHeight] = useState(220);
  const code = state.sceneLocal.code;
  const editable = scene.code?.editable ?? false;

  const handleMount: OnMount = (ed) => {
    editorRef.current = ed;
    // 高度跟随代码行数，避免几行代码占满整块区域
    const syncHeight = () => {
      setHeight(Math.min(Math.max(ed.getContentHeight() + 36, 160), 620));
    };
    syncHeight();
    ed.onDidContentSizeChange(syncHeight);
    ed.onDidFocusEditorText(() => onFocusChange?.(true));
    ed.onDidBlurEditorText(() => onFocusChange?.(false));
  };

  return (
    <div
      className="shrink-0 rounded-2xl overflow-hidden bg-code-bg"
      style={{ height: `${height}px` }}
    >
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        theme="classroom"
        beforeMount={defineTheme}
        onMount={handleMount}
        onChange={(value) => {
          if (editable && value !== undefined) {
            dispatch({ type: 'UPDATE_CODE', code: value });
          }
        }}
        options={{
          fontSize: 24,
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          readOnly: !editable,
          padding: { top: 18, bottom: 18 },
          wordWrap: 'on',
          tabSize: 4,
          renderLineHighlight: editable ? 'line' : 'none',
          overviewRulerLanes: 0,
          scrollbar: { horizontalScrollbarSize: 8, verticalScrollbarSize: 8 },
        }}
      />
    </div>
  );
}
