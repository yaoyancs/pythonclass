import { usePythonEngine } from '../../python/usePythonEngine';

export function EngineStatus() {
  const { status, statusMessage } = usePythonEngine();

  if (status === 'ready') {
    return (
      <div className="flex items-center gap-2 text-success text-sm">
        <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
        Python Ready
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 text-accent text-sm">
        <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        {statusMessage || 'Python Engine Loading...'}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-error text-sm">
        <span className="h-2 w-2 rounded-full bg-error" />
        {statusMessage || 'Python Engine Unavailable'}
      </div>
    );
  }

  return null;
}
