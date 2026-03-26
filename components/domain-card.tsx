'use client';

import Link from 'next/link';
import type { DomainConfig, AnalysisResult } from '@/types';
import { SeverityBadge } from '@/components/severity-badge';
import { TrendIndicator } from '@/components/trend-indicator';

interface DomainCardProps {
  config: DomainConfig;
  result: AnalysisResult | null;
}

export function DomainCard({ config, result }: DomainCardProps) {
  const alertCount = result?.alerts.length ?? 0;

  return (
    <Link href="/analyze" className="group block">
      <div
        className="relative overflow-hidden rounded-xl border border-slate-700 bg-[#1e293b] p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
        style={{
          boxShadow: result
            ? `0 0 20px ${config.color}15`
            : undefined,
        }}
      >
        {/* Domain Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <h3 className="text-lg font-semibold text-white">{config.label}</h3>
          </div>
          {alertCount > 0 && (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">
              {alertCount} alert{alertCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {result ? (
          <>
            {/* Risk Index */}
            <div className="mb-6 text-center">
              <div
                className="font-mono text-5xl font-bold transition-colors duration-300"
                style={{ color: config.color }}
              >
                {result.riskIndex.toFixed(1)}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                Risk Index
              </div>
            </div>

            {/* Status Row */}
            <div className="mb-6 flex items-center justify-between">
              <SeverityBadge severity={result.severity} size="sm" />
              <TrendIndicator trend={result.trend} />
            </div>

            {/* Top XAI Drivers */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Top Drivers
              </h4>
              {result.xaiContributions.slice(0, 3).map((contrib, index) => (
                <div
                  key={contrib.parameterId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-400">{contrib.parameterLabel}</span>
                  <span className="font-mono text-slate-300">
                    {contrib.contribution.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center text-slate-500">
            <div className="mb-2 text-4xl">--</div>
            <div className="text-sm">No data</div>
          </div>
        )}

        {/* Hover indicator */}
        <div
          className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
          style={{ backgroundColor: config.color }}
        />
      </div>
    </Link>
  );
}
