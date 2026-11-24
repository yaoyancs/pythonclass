export interface PythonError {
  type: string;
  message: string;
  traceback?: string;
}

export interface PythonResult {
  stdout: string;
  stderr: string;
  error?: PythonError;
}

export interface TraceVar {
  name: string;
  value: string;
  kind?: 'set' | 'list' | 'tuple' | 'dict' | 'value';
  items?: string[];
  pairs?: { k: string; v: string; items?: string[] }[];
  id?: number;
}

export interface TraceStep {
  line: number | null;
  vars: TraceVar[];
  stdout: string;
  done: boolean;
}

export interface CompletionItem {
  name: string;
  type: string;
  doc: string;
}

export interface SignatureHint {
  label: string;
  params: string[];
  index: number;
}

export type WorkerRequest =
  | { type: 'INIT' }
  | { type: 'RUN'; id: string; code: string; stdin: string[]; files?: Record<string, string> }
  | { type: 'TRACE'; id: string; code: string }
  | { type: 'COMPLETE'; id: string; code: string; line: number; column: number }
  | { type: 'SIGNATURE'; id: string; code: string; line: number; column: number }
  | { type: 'INPUT'; id: string; value: string }
  | { type: 'INTERRUPT'; id: string };

export type WorkerResponse =
  | { type: 'STATUS'; status: 'loading' | 'ready' | 'error'; message?: string; inputBuffer?: SharedArrayBuffer }
  | { type: 'INPUT_REQUEST'; id: string; prompt: string; stdout?: string }
  | { type: 'RESULT'; id: string; stdout: string; stderr: string; error?: PythonError }
  | { type: 'TRACE_RESULT'; id: string; steps: TraceStep[]; error?: string }
  | { type: 'COMPLETE_RESULT'; id: string; items: CompletionItem[] }
  | { type: 'SIGNATURE_RESULT'; id: string; hint: SignatureHint | null }
  | { type: 'INTERRUPTED'; id: string };

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error';
