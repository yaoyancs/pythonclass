import { useState } from 'react';
import { Button } from '../ui/Button';

interface InputPromptProps {
  prompt: string;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
}

export function InputPrompt({ prompt, onSubmit, onCancel }: InputPromptProps) {
  const [value, setValue] = useState('');

  return (
    <div className="rounded-2xl border border-classroom-border bg-classroom-stage p-4">
      <div>
        <p className="text-accent text-sm uppercase tracking-[0.18em] mb-2">Python input()</p>
        <p className="mb-3 font-mono text-lg text-text-primary">{prompt || '请输入：'}</p>
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit(value);
          }}
          className="w-full rounded-lg border border-classroom-border bg-classroom-stage px-4 py-3 text-xl text-text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <div className="flex gap-3 mt-3">
          <Button variant="primary" size="lg" className="flex-1" onClick={() => onSubmit(value)}>
            提交输入
          </Button>
          {onCancel && (
            <Button variant="ghost" size="lg" onClick={onCancel}>
              取消
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
