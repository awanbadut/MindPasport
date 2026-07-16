'use client';

import { type HTMLAttributes } from 'react';

type Variant = 'default' | 'flat' | 'outlined' | 'elevated';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {}

const variantClasses: Record<Variant, string> = {
  default:  'bg-white border border-slate-200 shadow-sm',
  flat:     'bg-slate-50 border border-slate-200',
  outlined: 'bg-white border-2 border-[#4F46E5]',
  elevated: 'bg-white border border-slate-100 shadow-lg',
};

const paddingClasses = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-6',
  xl:   'p-8',
};

export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-xl overflow-hidden',
        variantClasses[variant],
        paddingClasses[padding],
        hover ? 'card-hover cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={['flex items-start justify-between gap-4 mb-4', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-base font-semibold text-slate-900 leading-snug truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className = '', children, ...props }: CardSectionProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: CardSectionProps) {
  return (
    <div
      className={['pt-4 mt-4 border-t border-slate-100', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
