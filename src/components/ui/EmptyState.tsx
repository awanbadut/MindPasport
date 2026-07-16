'use client';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const defaultIcon = (
  <svg
    className="w-12 h-12 text-slate-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const sizeClasses = {
  sm: { wrapper: 'py-6', icon: 'mb-3', title: 'text-sm', desc: 'text-xs' },
  md: { wrapper: 'py-10', icon: 'mb-4', title: 'text-base', desc: 'text-sm' },
  lg: { wrapper: 'py-16', icon: 'mb-6', title: 'text-lg', desc: 'text-base' },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className = '',
}: EmptyStateProps) {
  const s = sizeClasses[size];

  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center',
        s.wrapper,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={s.icon}>{icon ?? defaultIcon}</div>
      <h3 className={`font-semibold text-slate-700 ${s.title}`}>{title}</h3>
      {description && (
        <p className={`mt-1 text-slate-500 max-w-xs ${s.desc}`}>{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
