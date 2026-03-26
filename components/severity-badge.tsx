import type { Severity } from '@/types';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
}

const severityConfig: Record<
  Severity,
  { label: string; bgColor: string; textColor: string; borderColor: string }
> = {
  safe: {
    label: 'SAFE',
    bgColor: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
  },
  warning: {
    label: 'WARNING',
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/50',
  },
  critical: {
    label: 'CRITICAL',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/50',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const config = severityConfig[severity];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold uppercase tracking-wide',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size]
      )}
    >
      <span
        className={cn('mr-1.5 h-2 w-2 rounded-full', {
          'bg-emerald-400 animate-pulse': severity === 'safe',
          'bg-amber-400 animate-pulse': severity === 'warning',
          'bg-red-400 animate-pulse': severity === 'critical',
        })}
      />
      {config.label}
    </span>
  );
}
