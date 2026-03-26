import type { Trend } from '@/types';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  trend: Trend;
}

const trendConfig: Record<
  Trend,
  { icon: string; color: string; bgColor: string }
> = {
  Improving: {
    icon: '↑',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
  },
  Stable: {
    icon: '→',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/20',
  },
  Degrading: {
    icon: '↓',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
};

export function TrendIndicator({ trend }: TrendIndicatorProps) {
  const config = trendConfig[trend];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-3 py-1.5',
        config.bgColor
      )}
    >
      <span className={cn('text-xl font-bold', config.color)}>
        {config.icon}
      </span>
      <span className={cn('text-sm font-medium', config.color)}>{trend}</span>
    </div>
  );
}
