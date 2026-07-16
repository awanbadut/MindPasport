'use client';

type Variant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  dot?: boolean;
  rounded?: boolean;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default:   'bg-slate-100 text-slate-700',
  primary:   'bg-indigo-100 text-indigo-700',
  secondary: 'bg-sky-100 text-sky-700',
  success:   'bg-green-100 text-green-700',
  warning:   'bg-amber-100 text-amber-700',
  danger:    'bg-red-100 text-red-700',
  outline:   'bg-transparent border border-slate-300 text-slate-600',
};

const dotColors: Record<Variant, string> = {
  default:   'bg-slate-400',
  primary:   'bg-indigo-500',
  secondary: 'bg-sky-500',
  success:   'bg-green-500',
  warning:   'bg-amber-500',
  danger:    'bg-red-500',
  outline:   'bg-slate-400',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-1 gap-1.5',
  lg: 'text-sm px-2.5 py-1 gap-1.5',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  rounded = false,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium',
        variantClasses[variant],
        sizeClasses[size],
        rounded ? 'rounded-full' : 'rounded-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && (
        <span
          className={['w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant]].join(' ')}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
