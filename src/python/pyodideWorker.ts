/// <reference lib="webworker" />
import { loadPyodide, version as pyodideVersion, type PyodideInterface } from 'pyodide';
import type { TraceStep, WorkerRequest, WorkerResponse } from '../types/python';

let pyodide: PyodideInterface | null = null;
let currentRunId: string | null = null;
let inputResolve: ((value: string) => void) | null = null;

const INPUT_SAB = new SharedArrayBuffer(65536);
const inputFlag = new Int32Array(INPUT_SAB, 0, 1);
const inputLen = new Int32Array(INPUT_SAB, 4, 1);
const inputBytes = new Uint8Array(INPUT_SAB);

function blockingInput(prompt: string, stdout: string): string {
  if (!currentRunId) return '';
  Atomics.store(inputFlag, 0, 0);
  post({
    type: 'INPUT_REQUEST',
    id: currentRunId,
    prompt: String(prompt ?? ''),
    stdout: String(stdout ?? ''),
  });
  Atomics.wait(inputFlag, 0, 0);
  const len = Atomics.load(inputLen, 0);
  return new TextDecoder().decode(inputBytes.slice(8, 8 + len));
}

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
    (self as unknown as { blockingInput: (prompt: string, stdout: string) => string }).blockingInput =
      blockingInput;

    await pyodide.runPythonAsync(`
import builtins, traceback
from js import blockingInput

def _patched_input(prompt=""):
    import sys
    captured = sys.stdout.getvalue() if hasattr(sys.stdout, "getvalue") else ""
    text = str(prompt) if prompt is not None else ""
    return str(blockingInput(text, captured))

builtins.input = _patched_input

def _pyclass_format_exc(exc):
    if isinstance(exc, SyntaxError) and getattr(exc, "filename", None) == "<stdin>":
        formatted = traceback.TracebackException(type(exc), exc, None)
        return "".join(formatted.format())
    formatted = traceback.TracebackException.from_exception(exc)
    frames = [frame for frame in formatted.stack if frame.filename == "<stdin>"]
    if frames:
        formatted.stack = traceback.StackSummary.from_list(frames)
    return "".join(formatted.format())

def __pyclass_trace(src):
    import sys, io, json
    out = io.StringIO()
    sys.stdout = out
    steps = []

    def snap(scope, line, done):
        vals = []
        for key, value in scope.items():
            if str(key).startswith("_"):
                continue
            cell = lambda x: x if isinstance(x, str) else repr(x)
            def pair(k, v):
                packed = {"k": cell(k), "v": cell(v)}
                if isinstance(v, list):
                    packed["items"] = [cell(x) for x in v]
                return packed
            entry = {"name": str(key), "value": repr(value), "kind": "value", "id": id(value)}
            if isinstance(value, dict):
                entry["kind"] = "dict"
                entry["pairs"] = [pair(k, v) for k, v in value.items()]
            elif isinstance(value, (set, list, tuple)):
                entry["kind"] = "set" if isinstance(value, set) else "tuple" if isinstance(value, tuple) else "list"
                entry["items"] = [cell(x) for x in value]
            vals.append(entry)
        steps.append({"line": line, "vars": vals, "stdout": out.getvalue(), "done": done})
        return len(steps) < 40

    def tracer(frame, event, arg):
        if frame.f_code.co_filename == "<stdin>" and event == "line":
            if not snap(frame.f_locals, frame.f_lineno, False):
                sys.settrace(None)
        return tracer

    ns = {}
    err = ""
    sys.settrace(tracer)
    try:
        exec(compile(src, "<stdin>", "exec"), ns, ns)
        snap(ns, None, True)
    except BaseException as exc:
        err = type(exc).__name__ + ": " + str(exc)
        snap(ns, None, True)
    finally:
        sys.settrace(None)
        sys.stdout = sys.__stdout__
    return json.dumps({"steps": steps, "error": err}, ensure_ascii=False)

def __pyclass_run():
    import sys, io
    global __pyclass_source
    src = __pyclass_source
    del __pyclass_source
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()
    exc_name = ""
    try:
        exec(compile(src, "<stdin>", "exec"), globals())
    except BaseException as exc:
        exc_name = type(exc).__name__
        sys.stderr.write(_pyclass_format_exc(exc))
    return "\\x1e".join((sys.stdout.getvalue(), sys.stderr.getvalue(), exc_name))
`);

    post({ type: 'STATUS', status: 'ready', message: 'Python Ready', inputBuffer: INPUT_SAB });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load Pyodide';
    post({ type: 'STATUS', status: 'error', message });
  }
}

function formatError(err: unknown): { type: string; message: string; traceback?: string } {
  if (err && typeof err === 'object' && 'message' in err) {
    const e = err as { name?: string; message: string; stack?: string; type?: string };
    const pyType = typeof e.type === 'string' && e.type ? e.type : e.name;
    if (pyType) return { type: pyType, message: e.message, traceback: e.stack };
  }
  return { type: 'Error', message: String(err) };
}

async function traceCode(id: string, code: string) {
  if (!pyodide) {
    post({ type: 'TRACE_RESULT', id, steps: [], error: 'Python engine not ready' });
    return;
  }
  try {
    const raw = String(await pyodide.runPythonAsync(`__pyclass_trace(${JSON.stringify(code)})`));
    const parsed = JSON.parse(raw) as { steps: TraceStep[]; error?: string };
    post({ type: 'TRACE_RESULT', id, steps: parsed.steps ?? [], error: parsed.error || undefined });
  } catch (err) {
    post({ type: 'TRACE_RESULT', id, steps: [], error: formatError(err).message });
  }
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
    pyodide.globals.set('__pyclass_source', code);
    const packed = String(await pyodide.runPythonAsync('__pyclass_run()'));
    const [stdout = '', stderr = '', excType = ''] = packed.split('\u001e');
    if (excType) {
      post({
        type: 'RESULT',
        id,
        stdout,
        stderr,
        error: { type: excType, message: stderr },
      });
    } else {
      post({ type: 'RESULT', id, stdout, stderr });
    }
  } catch (err) {
    post({
      type: 'RESULT',
      id,
      stdout: '',
      stderr: '',
      error: formatError(err),
    });
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
    case 'TRACE':
      void traceCode(msg.id, msg.code);
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
      Atomics.store(inputFlag, 0, 1);
      Atomics.notify(inputFlag, 0);
      post({ type: 'INTERRUPTED', id: msg.id });
      break;
  }
};

export {};
