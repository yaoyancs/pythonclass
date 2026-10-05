import type { EngineStatus, PythonResult, WorkerRequest, WorkerResponse } from '../types/python';

type InputHandler = (prompt: string) => Promise<string>;

let runCounter = 0;

export class PyodideClient {
  private worker: Worker | null = null;
  private status: EngineStatus = 'idle';
  private statusMessage?: string;
  private statusListeners = new Set<(s: EngineStatus, msg?: string) => void>();
  private inputSab: SharedArrayBuffer | null = null;
  private pendingRuns = new Map<
    string,
    {
      resolve: (r: PythonResult) => void;
      reject: (e: Error) => void;
      onInput?: InputHandler;
    }
  >();

  init(): void {
    if (this.worker) return;
    this.worker = new Worker(new URL('./pyodideWorker.ts', import.meta.url), { type: 'module' });
    this.status = 'loading';
    this.notifyStatus('loading', 'Python Engine Loading...');

    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      this.handleMessage(event.data);
    };

    this.worker.onerror = () => {
      this.status = 'error';
      this.notifyStatus('error', 'Python Engine Unavailable');
    };

    this.post({ type: 'INIT' });
  }

  onStatusChange(cb: (status: EngineStatus, message?: string) => void): () => void {
    this.statusListeners.add(cb);
    cb(this.status, this.statusMessage);
    return () => this.statusListeners.delete(cb);
  }

  getStatus(): EngineStatus {
    return this.status;
  }

  async runCode(code: string, onInput?: InputHandler): Promise<PythonResult> {
    if (!this.worker || this.status !== 'ready') {
      return {
        stdout: '',
        stderr: '',
        error: { type: 'EngineError', message: 'Python engine not ready' },
      };
    }

    const id = `run-${++runCounter}`;
    return new Promise((resolve, reject) => {
      this.pendingRuns.set(id, { resolve, reject, onInput });
      this.post({ type: 'RUN', id, code, stdin: [] });
    });
  }

  provideInput(value: string, runId?: string): void {
    const id = runId ?? [...this.pendingRuns.keys()].pop();
    if (id) this.post({ type: 'INPUT', id, value });
  }

  interrupt(): void {
    const id = [...this.pendingRuns.keys()].pop();
    if (id) this.post({ type: 'INTERRUPT', id });
  }

  destroy(): void {
    this.worker?.terminate();
    this.worker = null;
  }

  private fulfillInput(value: string): void {
    if (!this.inputSab) return;
    const i32 = new Int32Array(this.inputSab);
    const bytes = new Uint8Array(this.inputSab);
    const encoded = new TextEncoder().encode(value);
    const length = Math.min(encoded.length, this.inputSab.byteLength - 8);
    bytes.set(encoded.subarray(0, length), 8);
    i32[1] = length;
    Atomics.store(i32, 0, 1);
    Atomics.notify(i32, 0);
  }

  private post(msg: WorkerRequest) {
    this.worker?.postMessage(msg);
  }

  private notifyStatus(status: EngineStatus, message?: string) {
    this.status = status;
    this.statusMessage = message;
    this.statusListeners.forEach((cb) => cb(status, message));
  }

  private async handleMessage(msg: WorkerResponse) {
    switch (msg.type) {
      case 'STATUS':
        if (msg.inputBuffer) this.inputSab = msg.inputBuffer;
        this.notifyStatus(msg.status, msg.message);
        break;
      case 'INPUT_REQUEST': {
        const pending = this.pendingRuns.get(msg.id);
        const value = pending?.onInput ? await pending.onInput(msg.prompt) : '';
        this.fulfillInput(value);
        break;
      }
      case 'RESULT': {
        const pending = this.pendingRuns.get(msg.id);
        if (pending) {
          pending.resolve({
            stdout: msg.stdout,
            stderr: msg.stderr,
            error: msg.error,
          });
          this.pendingRuns.delete(msg.id);
        }
        break;
      }
      case 'INTERRUPTED': {
        const pending = this.pendingRuns.get(msg.id);
        if (pending) {
          pending.reject(new Error('Interrupted'));
          this.pendingRuns.delete(msg.id);
        }
        break;
      }
    }
  }
}

export const pyodideClient = new PyodideClient();
