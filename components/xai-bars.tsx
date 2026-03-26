'use client';

import type { XAIContribution } from '@/types';

interface XAIBarsProps {
  contributions: XAIContribution[];
  domainColor: string;
}

export function XAIBars({ contributions, domainColor }: XAIBarsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        XAI Explainability
      </h3>
      <div className="space-y-2">
        {contributions.map((contrib, index) => (
          <div key={contrib.parameterId} className="group">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-300">{contrib.parameterLabel}</span>
              <span className="font-mono text-slate-400">
                {contrib.contribution.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${contrib.contribution}%`,
                  backgroundColor: domainColor,
                  opacity: 1 - index * 0.1,
                  transitionDelay: `${index * 50}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
