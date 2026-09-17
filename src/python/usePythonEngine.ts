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
    async (code: string, onInput?: (prompt: string) => Promise<string>): Promise<PythonResult> => {
      return pyodideClient.runCode(code, onInput);
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
