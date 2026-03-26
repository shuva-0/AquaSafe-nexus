import type { DecisionTier } from '@/types';
import { cn } from '@/lib/utils';

interface DecisionPanelProps {
  decisions: DecisionTier[];
}

const tierConfig: Record<
  DecisionTier['tier'],
  { bgColor: string; borderColor: string; textColor: string; label: string }
> = {
  IMMEDIATE: {
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/40',
    textColor: 'text-red-400',
    label: 'Immediate Action Required',
  },
  'SHORT-TERM': {
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    label: 'Short-Term Actions',
  },
  'LONG-TERM': {
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/40',
    textColor: 'text-slate-300',
    label: 'Long-Term Recommendations',
  },
};

export function DecisionPanel({ decisions }: DecisionPanelProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Decision Engine
      </h3>
      <div className="space-y-3">
        {decisions.map((decision) => {
          const config = tierConfig[decision.tier];
          return (
            <div
              key={decision.tier}
              className={cn(
                'rounded-lg border p-4',
                config.bgColor,
                config.borderColor
              )}
            >
              <div
                className={cn(
                  'mb-2 text-sm font-semibold uppercase tracking-wide',
                  config.textColor
                )}
              >
                {config.label}
              </div>
              <ul className="space-y-1">
                {decision.actions.map((action, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <span className={cn('mt-1 text-xs', config.textColor)}>
                      •
                    </span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
