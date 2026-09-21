import { useState } from 'react';
import { Button } from '../ui/Button';
import { TeacherPanel } from './TeacherPanel';

interface TeacherUnlockPanelProps {
  busy: boolean;
  error: string | null;
  onSubmit: (pin: string) => Promise<boolean>;
  onClose: () => void;
}

export function TeacherUnlockPanel({ busy, error, onSubmit, onClose }: TeacherUnlockPanelProps) {
  const [pin, setPin] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || busy) return;
    const ok = await onSubmit(pin);
    if (ok) onClose();
  };

  return (
    <TeacherPanel title="解锁教师台" onClose={onClose} initialWidth={420} initialHeight={320}>
      <p className="text-text-secondary text-base">
        输入至少 8 位教师 PIN。请勿在投影上输入；教室 Wi‑Fi 下连续输错过多会暂时锁定该出口 IP。
      </p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
        <label className="flex flex-col gap-2 text-sm text-text-secondary">
          PIN
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="rounded-2xl border border-classroom-border bg-classroom-playground px-4 py-3 text-lg text-text-primary outline-none focus:border-accent"
            placeholder="至少 8 位"
          />
        </label>
        {error && <p className="text-error text-sm">{error}</p>}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
            取消
          </Button>
          <Button type="submit" variant="primary" disabled={busy || !pin.trim()}>
            {busy ? '验证中…' : '解锁'}
          </Button>
        </div>
      </form>
    </TeacherPanel>
  );
}
