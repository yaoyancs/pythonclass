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
  { value: '#d92d20', label: '红色' },
  { value: '#2563eb', label: '蓝色' },
  { value: '#111827', label: '黑色' },
  { value: '#f59e0b', label: '黄色' },
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
  const [width, setWidth] = useState(5);
  const [revision, setRevision] = useState(0);

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
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

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
    if (!active || !drawingRef.current) return;
    event.preventDefault();
    const stroke = strokesRef.current.at(-1);
    if (!stroke) return;
    stroke.points.push(pointFromEvent(event));
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
    strokesRef.current = [];
    setRevision((value) => value + 1);
    redraw();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 z-40 touch-none ${
          active ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
        }`}
        role="application"
        aria-label="课堂画笔标注层"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishStroke}
        onPointerCancel={finishStroke}
      />

      {active && (
        <aside
          className="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-classroom-border bg-white/95 p-2 shadow-card backdrop-blur"
          aria-label="课堂画笔工具"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition ${
              tool === 'pen' ? 'bg-accent text-white' : 'bg-classroom-playground text-text-primary'
            }`}
            onClick={() => setTool('pen')}
          >
            ✎ 画笔
          </button>
          <button
            type="button"
            className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition ${
              tool === 'eraser' ? 'bg-accent text-white' : 'bg-classroom-playground text-text-primary'
            }`}
            onClick={() => setTool('eraser')}
          >
            ◇ 橡皮
          </button>

          <div className="flex gap-2 border-l border-classroom-border pl-2">
            {COLORS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`h-6 w-6 rounded-full border-2 ${
                  color === item.value && tool === 'pen' ? 'border-accent ring-2 ring-accent/30' : 'border-white'
                }`}
                style={{ backgroundColor: item.value }}
                title={item.label}
                aria-label={item.label}
                onClick={() => {
                  setColor(item.value);
                  setTool('pen');
                }}
              />
            ))}
          </div>

          <label className="flex items-center gap-2 whitespace-nowrap text-xs text-text-secondary">
            粗细
            <input
              type="range"
              min="2"
              max="12"
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
              className="w-28 accent-accent"
            />
          </label>

          <div className="flex gap-2 border-l border-classroom-border pl-2">
            <button
              type="button"
              className="h-10 w-10 rounded-lg bg-classroom-playground text-base font-semibold text-text-primary disabled:opacity-40"
              disabled={strokesRef.current.length === 0}
              title="撤销上一笔"
              aria-label="撤销上一笔"
              onClick={undo}
            >
              ↶
            </button>
            <button
              type="button"
              className="h-10 w-10 rounded-lg bg-classroom-playground text-sm font-semibold text-text-primary disabled:opacity-40"
              disabled={strokesRef.current.length === 0}
              title="清空全部标注"
              aria-label="清空全部标注"
              onClick={clear}
            >
              清
            </button>
          </div>

          <button
            type="button"
            className="whitespace-nowrap rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white"
            onClick={() => onActiveChange(false)}
          >
            完成
          </button>
          <span className="sr-only" aria-live="polite">
            当前有 {revision} 次画笔操作
          </span>
        </aside>
      )}
    </>
  );
}
