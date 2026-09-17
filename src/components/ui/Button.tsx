import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed',
  secondary:
    'bg-classroom-stage border border-classroom-border text-text-primary hover:bg-classroom-playground disabled:opacity-40',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-classroom-playground disabled:opacity-40',
  danger: 'bg-error/10 text-error border border-error/40 hover:bg-error/20 disabled:opacity-40',
};

const sizes = {
  md: 'px-4 py-2 text-base font-medium',
  lg: 'px-6 py-3 text-lg font-semibold',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
