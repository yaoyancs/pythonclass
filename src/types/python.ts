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

export type WorkerRequest =
  | { type: 'INIT' }
  | { type: 'RUN'; id: string; code: string; stdin: string[] }
  | { type: 'INPUT'; id: string; value: string }
  | { type: 'INTERRUPT'; id: string };

export type WorkerResponse =
  | { type: 'STATUS'; status: 'loading' | 'ready' | 'error'; message?: string }
  | { type: 'INPUT_REQUEST'; id: string; prompt: string }
  | { type: 'RESULT'; id: string; stdout: string; stderr: string; error?: PythonError }
  | { type: 'INTERRUPTED'; id: string };

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error';
