/// <reference lib="webworker" />
import { loadPyodide, version as pyodideVersion, type PyodideInterface } from 'pyodide';
import type { WorkerRequest, WorkerResponse } from '../types/python';

let pyodide: PyodideInterface | null = null;
let currentRunId: string | null = null;
let inputResolve: ((value: string) => void) | null = null;

function post(msg: WorkerResponse) {
  self.postMessage(msg);
}

async function initPyodide() {
  post({ type: 'STATUS', status: 'loading', message: 'Python Engine Loading...' });
  try {
    // CDN 版本必须与 npm 包版本一致，否则 loadPyodide 会因版本校验失败而拒绝加载
    pyodide = await loadPyodide({
      indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
    });

    // 必须挂在 worker 全局对象上，Python 侧的 `from js import requestInput` 才能找到它
    (self as unknown as { requestInput: (prompt: string) => Promise<string> }).requestInput = (
      prompt: string,
    ) => {
      return new Promise<string>((resolve) => {
        if (!currentRunId) {
          resolve('');
          return;
        }
        inputResolve = resolve;
        post({ type: 'INPUT_REQUEST', id: currentRunId, prompt: String(prompt ?? '') });
      });
    };

    await pyodide.runPythonAsync(`
import builtins
from pyodide.ffi import run_sync
from js import requestInput

def _patched_input(prompt=""):
    return run_sync(requestInput(str(prompt) if prompt is not None else ""))

builtins.input = _patched_input
`);

    post({ type: 'STATUS', status: 'ready', message: 'Python Ready' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load Pyodide';
    post({ type: 'STATUS', status: 'error', message });
  }
}

function formatError(err: unknown): { type: string; message: string; traceback?: string } {
  if (err && typeof err === 'object' && 'name' in err && 'message' in err) {
    const e = err as { name: string; message: string; stack?: string };
    return { type: e.name, message: e.message, traceback: e.stack };
  }
  return { type: 'Error', message: String(err) };
}

async function runCode(id: string, code: string) {
  if (!pyodide) {
    post({
      type: 'RESULT',
      id,
      stdout: '',
      stderr: '',
      error: { type: 'EngineError', message: 'Python engine not ready' },
    });
    return;
  }

  currentRunId = id;
  try {
    await pyodide.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
    await pyodide.runPythonAsync(code);
    const stdout = (await pyodide.runPythonAsync('sys.stdout.getvalue()')) as string;
    const stderr = (await pyodide.runPythonAsync('sys.stderr.getvalue()')) as string;
    post({ type: 'RESULT', id, stdout, stderr });
  } catch (err) {
    const stdout = pyodide
      ? ((await pyodide.runPythonAsync('sys.stdout.getvalue()')) as string)
      : '';
    const stderr = pyodide
      ? ((await pyodide.runPythonAsync('sys.stderr.getvalue()')) as string)
      : '';
    post({ type: 'RESULT', id, stdout, stderr, error: formatError(err) });
  } finally {
    currentRunId = null;
    inputResolve = null;
  }
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;
  switch (msg.type) {
    case 'INIT':
      void initPyodide();
      break;
    case 'RUN':
      void runCode(msg.id, msg.code);
      break;
    case 'INPUT':
      if (inputResolve) {
        inputResolve(msg.value);
        inputResolve = null;
      }
      break;
    case 'INTERRUPT':
      currentRunId = null;
      if (inputResolve) {
        inputResolve('');
        inputResolve = null;
      }
      post({ type: 'INTERRUPTED', id: msg.id });
      break;
  }
};

export {};
