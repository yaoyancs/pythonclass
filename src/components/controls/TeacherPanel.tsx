import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';

interface TeacherPanelProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  /** 深色主题（提问抽点） */
  variant?: 'light' | 'dark';
  initialWidth?: number;
  initialHeight?: number;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 可拖拽、可缩放的教师控制台浮层（默认偏上居中，避免压在页脚） */
export function TeacherPanel({
  title,
  onClose,
  children,
  wide,
  variant = 'light',
  initialWidth,
  initialHeight,
}: TeacherPanelProps) {
  const defaultW = initialWidth ?? (wide ? 760 : 520);
  const defaultH = initialHeight ?? (wide ? 560 : 420);

  const [pos, setPos] = useState(() => ({
    x: Math.max(24, (window.innerWidth - defaultW) / 2),
    y: Math.max(24, window.innerHeight * 0.08),
  }));
  const [size, setSize] = useState({ w: defaultW, h: defaultH });
  const dragRef = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null);
  const resizeRef = useRef<{ ox: number; oy: number; w: number; h: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onDragPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = { ox: e.clientX, oy: e.clientY, px: pos.x, py: pos.y };
    },
    [pos.x, pos.y],
  );

  const onDragPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const nx = d.px + (e.clientX - d.ox);
    const ny = d.py + (e.clientY - d.oy);
    setPos({
      x: clamp(nx, 0, window.innerWidth - 120),
      y: clamp(ny, 0, window.innerHeight - 80),
    });
  }, []);

  const onDragPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      resizeRef.current = { ox: e.clientX, oy: e.clientY, w: size.w, h: size.h };
    },
    [size.w, size.h],
  );

  const onResizePointerMove = useCallback((e: React.PointerEvent) => {
    const r = resizeRef.current;
    if (!r) return;
    setSize({
      w: clamp(r.w + (e.clientX - r.ox), 360, window.innerWidth - 16),
      h: clamp(r.h + (e.clientY - r.oy), 280, window.innerHeight - 16),
    });
  }, []);

  const onResizePointerUp = useCallback(() => {
    resizeRef.current = null;
  }, []);

  const dark = variant === 'dark';

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      <div
        className={`pointer-events-auto absolute flex flex-col overflow-hidden rounded-3xl shadow-lift border ${
          dark
            ? 'bg-[#12211c] border-white/15 text-white'
            : 'bg-classroom-stage border-classroom-border'
        }`}
        style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          className={`flex items-center justify-between gap-4 px-5 py-3 border-b cursor-grab active:cursor-grabbing select-none ${
            dark ? 'border-white/10' : 'border-classroom-border/70'
          }`}
          onPointerDown={onDragPointerDown}
          onPointerMove={onDragPointerMove}
          onPointerUp={onDragPointerUp}
          onPointerCancel={onDragPointerUp}
        >
          <div className="min-w-0">
            <h2 className={`title-kai text-2xl truncate ${dark ? 'text-white' : 'text-text-primary'}`}>
              {title}
            </h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-white/45' : 'text-text-secondary'}`}>
              拖拽标题栏移动 · 右下角缩放
            </p>
          </div>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            className={dark ? 'text-white/80 hover:bg-white/10' : ''}
          >
            关闭
          </Button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">{children}</div>
        <div
          className={`absolute right-1 bottom-1 w-5 h-5 cursor-se-resize ${
            dark ? 'text-white/40' : 'text-text-secondary/50'
          }`}
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
          aria-label="缩放面板"
          title="拖动缩放"
        >
          <svg viewBox="0 0 16 16" className="w-full h-full" aria-hidden>
            <path
              d="M10 14h4v-4M6 14h2M14 6v2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
