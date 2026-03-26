import type { Alert, AlertLevel } from '@/types';
import { cn } from '@/lib/utils';

interface AlertsListProps {
  alerts: Alert[];
}

const alertConfig: Record<
  AlertLevel,
  { bgColor: string; borderColor: string; textColor: string; icon: string }
> = {
  INFO: {
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    icon: 'ℹ',
  },
  WARNING: {
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    icon: '⚠',
  },
  CRITICAL: {
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    icon: '✕',
  },
};

export function AlertsList({ alerts }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center text-sm text-slate-500">
        No active alerts
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Active Alerts
      </h3>
      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const config = alertConfig[alert.level];
          return (
            <div
              key={`${alert.parameterId}-${index}`}
              className={cn(
                'flex items-center justify-between rounded-lg border p-3',
                config.bgColor,
                config.borderColor
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn('text-lg', config.textColor)}>
                  {config.icon}
                </span>
                <div>
                  <div className={cn('font-medium', config.textColor)}>
                    {alert.parameterLabel}
                  </div>
                  <div className="text-xs text-slate-500">
                    Penalty: {alert.penalty.toFixed(1)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn('font-mono font-semibold', config.textColor)}>
                  {alert.value.toFixed(1)} {alert.unit}
                </div>
                <div
                  className={cn(
                    'text-xs font-semibold uppercase',
                    config.textColor
                  )}
                >
                  {alert.level}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
