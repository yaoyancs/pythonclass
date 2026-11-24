import type { languages, editor } from 'monaco-editor';
import { pyodideClient } from './pyodideClient';

type Monaco = {
  languages: typeof languages;
};

let registered = false;

function kindOf(monaco: Monaco, type: string): languages.CompletionItemKind {
  const kinds = monaco.languages.CompletionItemKind;
  switch (type) {
    case 'function':
      return kinds.Function;
    case 'class':
      return kinds.Class;
    case 'module':
      return kinds.Module;
    case 'keyword':
      return kinds.Keyword;
    default:
      return kinds.Variable;
  }
}

/** 把 Jedi 的补全和参数签名接到 Monaco 的 Python 语言上。只注册一次。 */
export function registerJediCompletion(monaco: Monaco) {
  if (registered) return;
  registered = true;

  monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.', '('],
    provideCompletionItems: async (model: editor.ITextModel, position: { lineNumber: number; column: number }) => {
      const items = await pyodideClient.complete(model.getValue(), position.lineNumber, position.column - 1);
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: items.map((item) => ({
          label: item.name,
          kind: kindOf(monaco, item.type),
          insertText: item.name,
          detail: item.type,
          documentation: item.doc,
          range,
        })),
      };
    },
  });

  monaco.languages.registerSignatureHelpProvider('python', {
    signatureHelpTriggerCharacters: ['(', ','],
    signatureHelpRetriggerCharacters: [','],
    provideSignatureHelp: async (model: editor.ITextModel, position: { lineNumber: number; column: number }) => {
      const hint = await pyodideClient.signature(model.getValue(), position.lineNumber, position.column - 1);
      if (!hint) return null;
      return {
        value: {
          signatures: [
            {
              label: hint.label,
              parameters: hint.params.map((label) => ({ label })),
            },
          ],
          activeSignature: 0,
          activeParameter: hint.index,
        },
        dispose() {},
      };
    },
  });
}
