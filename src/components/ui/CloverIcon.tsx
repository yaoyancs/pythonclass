interface CloverIconProps {
  className?: string;
  title?: string;
}

/** 手绘感四叶幸运草（与小红花同风格） */
export function CloverIcon({ className = 'w-6 h-6', title = '幸运草' }: CloverIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`inline-block align-[-0.15em] ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <ellipse cx="16" cy="8.2" rx="5.4" ry="6.2" fill="#16a34a" />
      <ellipse cx="16" cy="23.8" rx="5.4" ry="6.2" fill="#15803d" />
      <ellipse cx="8.2" cy="16" rx="6.2" ry="5.4" fill="#16a34a" />
      <ellipse cx="23.8" cy="16" rx="6.2" ry="5.4" fill="#15803d" />
      <ellipse cx="10.2" cy="10.2" rx="4.2" ry="4.6" fill="#22c55e" />
      <ellipse cx="21.8" cy="10.2" rx="4.2" ry="4.6" fill="#22c55e" />
      <ellipse cx="10.2" cy="21.8" rx="4.2" ry="4.6" fill="#4ade80" />
      <ellipse cx="21.8" cy="21.8" rx="4.2" ry="4.6" fill="#4ade80" />
      <circle cx="16" cy="16" r="2.4" fill="#14532d" />
      <path d="M16 18.5 C16 22 18.5 26.5 21 28" fill="none" stroke="#166534" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CloverCount({
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
      <CloverIcon className={iconClassName} />
      <span>×{count}</span>
    </span>
  );
}
