interface Props {
  kind: string;
  className?: string;
}

/** 值旁边的浅色类型标，不做成 Frames/Objects 分栏。 */
export function TypeBadge({ kind, className = '' }: Props) {
  return (
    <span
      className={`rounded-full bg-accent-muted px-2 py-0.5 font-mono text-xs tracking-wide text-accent ${className}`}
    >
      {kind}
    </span>
  );
}
