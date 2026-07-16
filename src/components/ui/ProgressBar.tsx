'use client';

type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'slate';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;       // 0–100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: Color;
  size?: Size;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const trackClasses: Record<Size, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const fillColors: Record<Color, string> = {
  primary:   'bg-[#4F46E5]',
  secondary: 'bg-[#0EA5E9]',
  success:   'bg-[#16A34A]',
  warning:   'bg-[#F59E0B]',
  danger:    'bg-[#DC2626]',
  slate:     'bg-slate-400',
};

const gradientColors: Record<Color, string> = {
  primary:   'from-indigo-400 to-[#4F46E5]',
  secondary: 'from-sky-300 to-[#0EA5E9]',
  success:   'from-green-400 to-[#16A34A]',
  warning:   'from-amber-300 to-[#F59E0B]',
  danger:    'from-red-400 to-[#DC2626]',
  slate:     'from-slate-300 to-slate-400',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'primary',
  size = 'md',
  animated = true,
  striped = false,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-slate-700">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-semibold text-slate-500 ml-auto">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}

      <div
        className={['w-full bg-slate-100 rounded-full overflow-hidden', trackClasses[size]].join(' ')}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={[
            'h-full rounded-full bg-gradient-to-r',
            gradientColors[color],
            striped
              ? 'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.15)_0,rgba(255,255,255,0.15)_10px,transparent_10px,transparent_20px)]'
              : '',
            animated ? 'progress-animate' : '',
            'transition-[width] duration-700 ease-out',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
