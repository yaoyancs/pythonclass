import { useCallback, useEffect, useRef, useState } from 'react';

type Tool = 'pen' | 'eraser';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  tool: Tool;
  color: string;
  width: number;
  points: Point[];
}

interface AnnotationCanvasProps {
  active: boolean;
  sceneId: string;
  onActiveChange: (active: boolean) => void;
}

const COLORS = [
  { value: '#d92d20', label: '红' },
  { value: '#16a34a', label: '绿' },
  { value: '#2563eb', label: '蓝' },
  { value: '#7c3aed', label: '紫' },
];

const WIDTHS = [
  { value: 3, label: '细' },
  { value: 6, label: '中' },
  { value: 12, label: '粗' },
];

export function AnnotationCanvas({
  active,
  sceneId,
  onActiveChange,
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState(COLORS[0].value);
  const [width, setWidth] = useState(6);
  const [revision, setRevision] = useState(0);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [dock, setDock] = useState({ x: 16, y: 88 });
  const dragRef = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null);

  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    const { points } = stroke;
    if (points.length === 0) return;

    ctx.save();
    ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.lineWidth = stroke.tool === 'eraser' ? stroke.width * 3 : stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (points.length === 1) {
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let index = 1; index < points.length; index += 1) {
        ctx.lineTo(points[index].x, points[index].y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    strokesRef.current.forEach((stroke) => drawStroke(ctx, stroke));
  }, [drawStroke]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    redraw();
  }, [redraw]);

  useEffect(() => {
    if (!active) return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [active, resizeCanvas]);

  useEffect(() => {
    strokesRef.current = [];
    drawingRef.current = false;
    setRevision((value) => value + 1);
    redraw();
  }, [sceneId, redraw]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    strokesRef.current.push({
      tool,
      color,
      width,
      points: [pointFromEvent(event)],
    });
    redraw();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active) return;
    const point = pointFromEvent(event);
    setCursor(point);
    if (!drawingRef.current) return;
    event.preventDefault();
    const stroke = strokesRef.current.at(-1);
    if (!stroke) return;
    stroke.points.push(point);
    redraw();
  };

  const finishStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setRevision((value) => value + 1);
  };

  const undo = () => {
    strokesRef.current.pop();
    setRevision((value) => value + 1);
    redraw();
  };

  const clear = () => {
    if (!strokesRef.current.length) return;
    if (!window.confirm('清空本页全部标注？')) return;
    strokesRef.current = [];
    setRevision((value) => value + 1);
    redraw();
  };

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        strokesRef.current.pop();
        setRevision((value) => value + 1);
        redraw();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, redraw]);

  const cursorSize = tool === 'eraser' ? width * 3 : width;

  return (
    <>
      {active && (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-40 touch-none cursor-crosshair"
        role="application"
        aria-label="课堂画笔标注层"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishStroke}
        onPointerCancel={finishStroke}
        onPointerLeave={() => setCursor(null)}
      />
      )}

      {active && cursor && (
        <div
          className="pointer-events-none fixed z-50 rounded-full border-2"
          style={{
            left: cursor.x,
            top: cursor.y,
            width: cursorSize,
            height: cursorSize,
            transform: 'translate(-50%, -50%)',
            borderColor: tool === 'eraser' ? '#6b7280' : color,
            backgroundColor: tool === 'eraser' ? 'rgba(255,255,255,0.35)' : color,
            opacity: tool === 'eraser' ? 1 : 0.85,
          }}
          aria-hidden
        />
      )}

      {active && (
        <aside
          className="fixed z-[80] w-[15.5rem] rounded-2xl border border-classroom-border bg-white/95 p-2.5 shadow-card backdrop-blur"
          style={{ right: dock.x, top: dock.y }}
          aria-label="课堂画笔工具"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div
            className="mb-2 flex cursor-grab items-center justify-between active:cursor-grabbing"
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest('button')) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              dragRef.current = { ox: event.clientX, oy: event.clientY, px: dock.x, py: dock.y };
            }}
            onPointerMove={(event) => {
              const drag = dragRef.current;
              if (!drag) return;
              setDock({
                x: Math.max(8, drag.px - (event.clientX - drag.ox)),
                y: Math.max(8, drag.py + (event.clientY - drag.oy)),
              });
            }}
            onPointerUp={() => {
              dragRef.current = null;
            }}
          >
            <p className="text-xs text-text-secondary">拖这里挪开工具条 · Esc 退出</p>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              className={`rounded-xl px-2 py-1.5 text-sm font-semibold ${
                tool === 'pen' ? 'bg-accent text-white' : 'bg-classroom-playground text-text-primary'
              }`}
              onClick={() => setTool('pen')}
            >
              ✎ 画笔
            </button>
            <button
              type="button"
              className={`rounded-xl px-2 py-1.5 text-sm font-semibold ${
                tool === 'eraser' ? 'bg-accent text-white' : 'bg-classroom-playground text-text-primary'
              }`}
              onClick={() => setTool('eraser')}
            >
              橡皮
            </button>
          </div>

          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {COLORS.map((item) => {
              const selected = color === item.value && tool === 'pen';
              return (
                <button
                  key={item.value}
                  type="button"
                  className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-semibold ${
                    selected ? 'ring-2 ring-accent' : 'ring-1 ring-classroom-border'
                  }`}
                  style={{ backgroundColor: item.value, color: '#fff' }}
                  aria-label={item.label}
                  aria-pressed={selected}
                  onClick={() => {
                    setColor(item.value);
                    setTool('pen');
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {WIDTHS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`rounded-xl py-1.5 text-xs font-semibold ${
                  width === item.value
                    ? 'bg-text-primary text-white'
                    : 'bg-classroom-playground text-text-primary'
                }`}
                onClick={() => setWidth(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <button
              type="button"
              className="rounded-xl bg-classroom-playground py-1.5 text-xs font-semibold text-text-primary disabled:opacity-40"
              disabled={strokesRef.current.length === 0}
              onClick={undo}
            >
              撤销
            </button>
            <button
              type="button"
              className="rounded-xl bg-classroom-playground py-1.5 text-xs font-semibold text-text-primary disabled:opacity-40"
              disabled={strokesRef.current.length === 0}
              onClick={clear}
            >
              清空
            </button>
            <button
              type="button"
              className="rounded-xl bg-accent py-1.5 text-xs font-semibold text-white"
              onClick={() => onActiveChange(false)}
            >
              完成
            </button>
          </div>
          <span className="sr-only" aria-live="polite">
            当前有 {revision} 次画笔操作
          </span>
        </aside>
      )}
    </>
  );
}
