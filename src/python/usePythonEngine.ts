import { useEffect, useState, useCallback } from 'react';
import { pyodideClient } from './pyodideClient';
import type { EngineStatus, PythonResult } from '../types/python';

export function usePythonEngine() {
  const [status, setStatus] = useState<EngineStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    pyodideClient.init();
    return pyodideClient.onStatusChange((s, msg) => {
      setStatus(s);
      if (msg) setStatusMessage(msg);
    });
  }, []);

  const runCode = useCallback(
    async (
      code: string,
      onInput?: (prompt: string, stdout: string) => Promise<string>,
      files?: Record<string, string>,
    ): Promise<PythonResult> => {
      return pyodideClient.runCode(code, onInput, files);
    },
    [],
  );

  return {
    status,
    statusMessage,
    isReady: status === 'ready',
    runCode,
  };
}
