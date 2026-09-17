interface FlowerIconProps {
  className?: string;
  title?: string;
}

/** 手绘感小红花（替代 emoji，投影更清晰） */
export function FlowerIcon({ className = 'w-6 h-6', title = '小红花' }: FlowerIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`inline-block align-[-0.15em] ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="16" cy="16" r="4.2" fill="#f59e0b" />
      <ellipse cx="16" cy="7.2" rx="5.2" ry="6.4" fill="#e11d48" />
      <ellipse cx="16" cy="24.8" rx="5.2" ry="6.4" fill="#e11d48" />
      <ellipse cx="7.2" cy="16" rx="6.4" ry="5.2" fill="#be123c" />
      <ellipse cx="24.8" cy="16" rx="6.4" ry="5.2" fill="#be123c" />
      <ellipse cx="9.5" cy="9.5" rx="4.8" ry="5.6" transform="rotate(-40 9.5 9.5)" fill="#f43f5e" />
      <ellipse cx="22.5" cy="9.5" rx="4.8" ry="5.6" transform="rotate(40 22.5 9.5)" fill="#f43f5e" />
      <ellipse cx="9.5" cy="22.5" rx="4.8" ry="5.6" transform="rotate(40 9.5 22.5)" fill="#e11d48" />
      <ellipse cx="22.5" cy="22.5" rx="4.8" ry="5.6" transform="rotate(-40 22.5 22.5)" fill="#e11d48" />
      <circle cx="16" cy="16" r="3.2" fill="#fbbf24" />
      <circle cx="16" cy="16" r="1.4" fill="#92400e" />
    </svg>
  );
}

export function FlowerCount({
  count,
  className = '',
  iconClassName = 'w-5 h-5',
}: {
  count: number;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${className}`}>
      <FlowerIcon className={iconClassName} />
      <span>×{count}</span>
    </span>
  );
}
