import type { CatalogItem, GradeItem, InfoCard, SceneImage, ScheduleBlock } from '../../types/scene';
import { Fragment } from 'react';

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

export function CatalogList({ items }: { items: CatalogItem[] }) {
  return (
    <ol className="mt-12 space-y-6">
      {items.map((item) => (
        <li key={item.index} className="flex items-baseline gap-8">
          <span className="text-accent text-2xl tabular-nums tracking-widest">{item.index}</span>
          <span className="title-stage text-stage-body">{item.title}</span>
        </li>
      ))}
    </ol>
  );
}
