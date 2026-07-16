'use client';

import { type HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: boolean | string;
  lines?: number;
}

/** Single skeleton block */
export function Skeleton({
  width,
  height,
  rounded = false,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={[
        'skeleton',
        typeof rounded === 'boolean'
          ? rounded ? 'rounded-full' : 'rounded-md'
          : `rounded-${rounded}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        width: width ?? '100%',
        height: height ?? '1rem',
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Multiple text lines */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          rounded="md"
          height="0.875rem"
          width={i === lines - 1 ? '65%' : '100%'}
        />
      ))}
    </div>
  );
}

/** Full card skeleton */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={[
        'bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} rounded />
        <div className="flex-1 space-y-2">
          <Skeleton height="1rem" width="60%" rounded="md" />
          <Skeleton height="0.75rem" width="40%" rounded="md" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <Skeleton height="0.625rem" rounded="full" />
    </div>
  );
}

/** Stat card skeleton */
export function SkeletonStat({ className = '' }: { className?: string }) {
  return (
    <div
      className={[
        'bg-white border border-slate-200 rounded-xl p-5 shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Skeleton height="0.75rem" width="50%" rounded="md" />
      <Skeleton height="2.5rem" width="70%" rounded="md" className="mt-3" />
      <Skeleton height="0.625rem" width="80%" rounded="full" className="mt-4" />
    </div>
  );
}

export default Skeleton;
