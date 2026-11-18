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

export type WorkerRequest =
  | { type: 'INIT' }
  | { type: 'RUN'; id: string; code: string; stdin: string[]; files?: Record<string, string> }
  | { type: 'TRACE'; id: string; code: string }
  | { type: 'INPUT'; id: string; value: string }
  | { type: 'INTERRUPT'; id: string };

export type WorkerResponse =
  | { type: 'STATUS'; status: 'loading' | 'ready' | 'error'; message?: string; inputBuffer?: SharedArrayBuffer }
  | { type: 'INPUT_REQUEST'; id: string; prompt: string; stdout?: string }
  | { type: 'RESULT'; id: string; stdout: string; stderr: string; error?: PythonError }
  | { type: 'TRACE_RESULT'; id: string; steps: TraceStep[]; error?: string }
  | { type: 'INTERRUPTED'; id: string };

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error';
