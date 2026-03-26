'use client';

import { useCallback } from 'react';
import type { ParameterConfig } from '@/types';
import { calculatePenalty } from '@/lib/engine';

interface ParameterSliderProps {
  config: ParameterConfig;
  value: number;
  onChange: (value: number) => void;
}

function getPenaltyColor(penalty: number): string {
  if (penalty >= 60) return '#ef4444';
  if (penalty >= 20) return '#f59e0b';
  return '#10b981';
}

export function ParameterSlider({
  config,
  value,
  onChange,
}: ParameterSliderProps) {
  const penalty = calculatePenalty(value, config);
  const color = getPenaltyColor(penalty);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange]
  );

  // Calculate safe range position for visual indicator
  const safeStartPercent =
    ((config.safeMin - config.min) / (config.max - config.min)) * 100;
  const safeEndPercent =
    ((config.safeMax - config.min) / (config.max - config.min)) * 100;

  const valuePercent =
    ((value - config.min) / (config.max - config.min)) * 100;

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-300">
          {config.label}
        </label>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-lg font-semibold transition-colors duration-200"
            style={{ color }}
          >
            {config.id === 'crackIndex' ? value.toFixed(2) : value.toFixed(1)}
          </span>
          {config.unit && (
            <span className="text-xs text-slate-500">{config.unit}</span>
          )}
        </div>
      </div>

      <div className="relative h-6">
        {/* Track background */}
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-700">
          {/* Safe range indicator */}
          <div
            className="absolute top-0 h-full rounded-full bg-emerald-900/50"
            style={{
              left: `${safeStartPercent}%`,
              width: `${safeEndPercent - safeStartPercent}%`,
            }}
          />
        </div>

        {/* Custom thumb indicator */}
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white transition-all duration-150"
          style={{
            left: `${valuePercent}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />

        {/* Actual input range */}
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.id === 'crackIndex' ? 0.01 : 0.1}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      {/* Range labels */}
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span className="font-mono">{config.min}</span>
        <span className="text-emerald-600">
          Safe: {config.safeMin} - {config.safeMax}
        </span>
        <span className="font-mono">{config.max}</span>
      </div>
    </div>
  );
}
