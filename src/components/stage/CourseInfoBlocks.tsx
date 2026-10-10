import type { CatalogItem, GalleryLink, GradeItem, InfoCard, SceneImage, ScheduleBlock } from '../../types/scene';
import { Fragment, useRef, useState } from 'react';

export function SceneSideImage({ image }: { image: SceneImage }) {
  return (
    <figure className="justify-self-center">
      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[26rem] w-auto rounded-3xl bg-classroom-stage shadow-card object-contain"
      />
      {image.caption && (
        <figcaption className="mt-4 text-center text-lg text-text-secondary">{image.caption}</figcaption>
      )}
    </figure>
  );
}

export function SceneGallery({ images, links }: { images: SceneImage[]; links?: GalleryLink[] }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({});
  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string } | null>(
    null,
  );
  const [drawKey, setDrawKey] = useState(0);
  const sources = new Set(links?.map((item) => item.from));

  function connect(fromId: string) {
    const link = links?.find((item) => item.from === fromId);
    const board = boardRef.current;
    const from = nodeRefs.current[fromId];
    const to = link ? nodeRefs.current[link.to] : null;
    if (!link || !board || !from || !to) return;
    const origin = board.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    setLine({
      x1: a.left + a.width / 2 - origin.left,
      y1: a.top + a.height / 2 - origin.top,
      x2: b.left + b.width / 2 - origin.left,
      y2: b.top + b.height / 2 - origin.top,
      color: link.color,
    });
    setDrawKey((key) => key + 1);
  }

  return (
    <div ref={boardRef} className="relative mt-6">
      <ul className="grid grid-cols-4 gap-x-5 gap-y-48">
        {images.map((image) => {
          const clickable = Boolean(image.id && sources.has(image.id));
          const frame = (
            <img
              src={image.src}
              alt={image.alt}
              className="mx-auto h-32 w-full object-contain"
            />
          );
          return (
            <li key={image.src}>
              {clickable ? (
                <button
                  type="button"
                  ref={(node) => {
                    if (image.id) nodeRefs.current[image.id] = node;
                  }}
                  className="block w-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={image.alt}
                  onClick={() => image.id && connect(image.id)}
                >
                  {frame}
                </button>
              ) : (
                <div
                  ref={(node) => {
                    if (image.id) nodeRefs.current[image.id] = node;
                  }}
                >
                  {frame}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {line && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <line
            key={drawKey}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            className="gallery-link-draw"
          />
        </svg>
      )}
    </div>
  );
}

export function ScheduleList({ blocks }: { blocks: ScheduleBlock[] }) {
  return (
    <div className="mt-10 space-y-6">
      {blocks.map((block) => (
        <div key={block.title} className="rounded-3xl bg-classroom-stage shadow-card px-8 py-6">
          <p className="title-stage text-2xl text-text-primary">{block.title}</p>
          <p className="text-lg text-accent mt-1">{block.subtitle}</p>
          <ul className="mt-4 space-y-2">
            {block.rows.map((row) => (
              <li key={`${row.time}-${row.place}`} className="text-stage-sub flex flex-wrap gap-x-6">
                <span>{row.time}</span>
                <span className="text-text-secondary">{row.place}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function InfoCardGrid({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="mt-8 space-y-4">
      {cards.map((card, i) => (
        <div key={card.title} className="rounded-3xl bg-classroom-stage shadow-card px-7 py-4">
          <p className="text-accent text-lg tracking-wide">
            {String(i + 1).padStart(2, '0')}　{card.title}
          </p>
          {card.href && (
            <a
              href={card.href}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-lg text-accent underline underline-offset-4"
            >
              {card.href}
            </a>
          )}
          <ul className="mt-3 space-y-2">
            {card.items.map((item) => (
              <li key={item} className="text-stage-sub font-medium flex items-baseline gap-3 text-text-primary">
                <span className="h-2 w-2 rounded-full bg-accent shrink-0 translate-y-[-0.2em]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function GradeTable({ items }: { items: GradeItem[] }) {
  return (
    <div className="mt-10 rounded-3xl bg-classroom-stage shadow-card overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="text-lg text-text-secondary border-b border-classroom-border">
            <th className="px-8 py-4 font-normal">项目</th>
            <th className="px-8 py-4 font-normal w-32">占比</th>
            <th className="px-8 py-4 font-normal">说明</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <Fragment key={item.label}>
              <tr className="border-b border-classroom-border/70">
                <td className="px-8 py-4 text-xl">{item.label}</td>
                <td className="px-8 py-4 text-2xl text-accent tabular-nums">{item.percent}</td>
                <td className="px-8 py-4 text-lg text-text-secondary">{item.note ?? ''}</td>
              </tr>
              {item.children?.map((child) => (
                <tr key={child.label} className="border-b border-classroom-border/40">
                  <td className="px-8 py-3 pl-16 text-lg text-text-secondary">{child.label}</td>
                  <td className="px-8 py-3 text-xl tabular-nums text-text-secondary">{child.percent}</td>
                  <td className="px-8 py-3 text-lg text-text-secondary">{child.note ?? ''}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CatalogList({
  items,
  onSelect,
}: {
  items: CatalogItem[];
  /** 点击某一目录项时回调（如跳到该知识块首页） */
  onSelect?: (item: CatalogItem) => void;
}) {
  return (
    <ol className="mt-12 space-y-6">
      {items.map((item) => {
        const clickable = Boolean(onSelect);
        const inner = (
          <>
            <span className="text-accent text-2xl tabular-nums tracking-widest">{item.index}</span>
            <span className="title-stage text-stage-body">{item.title}</span>
          </>
        );
        return (
          <li key={item.index}>
            {clickable ? (
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                className="flex w-full items-baseline gap-8 text-left rounded-2xl px-3 py-2 -mx-3 transition-colors hover:bg-classroom-stage/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                {inner}
              </button>
            ) : (
              <div className="flex items-baseline gap-8">{inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
