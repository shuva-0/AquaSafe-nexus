'use client';

import { useEffect, useState } from 'react';
import type { Severity } from '@/types';

interface RiskGaugeProps {
  value: number;
  severity: Severity;
  size?: number;
}

const severityColors: Record<Severity, string> = {
  safe: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
};

export function RiskGauge({ value, severity, size = 200 }: RiskGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const startTime = performance.now();
    const startValue = animatedValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(startValue + (value - startValue) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circle
  const offset = circumference - (animatedValue / 100) * circumference;

  const color = severityColors[severity];

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size / 2 + 30}
        viewBox={`0 0 ${size} ${size / 2 + 30}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#334155"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Animated value arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke 0.3s ease',
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />

        {/* Center value text */}
        <text
          x={size / 2}
          y={size / 2 - 10}
          textAnchor="middle"
          className="font-mono text-4xl font-bold"
          fill={color}
        >
          {Math.round(animatedValue)}
        </text>

        {/* Label */}
        <text
          x={size / 2}
          y={size / 2 + 20}
          textAnchor="middle"
          className="text-sm"
          fill="#94a3b8"
        >
          RISK INDEX
        </text>
      </svg>
    </div>
  );
}
