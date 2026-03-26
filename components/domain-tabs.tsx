'use client';

import type { DomainType } from '@/types';
import { domainConfigs } from '@/lib/domains';
import { cn } from '@/lib/utils';

interface DomainTabsProps {
  activeDomain: DomainType;
  onDomainChange: (domain: DomainType) => void;
}

const domains: DomainType[] = ['water', 'infrastructure', 'environment'];

export function DomainTabs({ activeDomain, onDomainChange }: DomainTabsProps) {
  return (
    <div className="relative flex rounded-lg bg-slate-800 p-1">
      {/* Animated background slider */}
      <div
        className="absolute inset-y-1 rounded-md transition-all duration-300 ease-out"
        style={{
          width: `${100 / domains.length}%`,
          left: `${(domains.indexOf(activeDomain) / domains.length) * 100}%`,
          backgroundColor: domainConfigs[activeDomain].color,
          opacity: 0.2,
        }}
      />

      {domains.map((domain) => {
        const config = domainConfigs[domain];
        const isActive = domain === activeDomain;

        return (
          <button
            key={domain}
            onClick={() => onDomainChange(domain)}
            className={cn(
              'relative z-10 flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200',
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <span
                className={cn('h-2 w-2 rounded-full transition-all duration-200', {
                  'scale-100': isActive,
                  'scale-75 opacity-50': !isActive,
                })}
                style={{ backgroundColor: config.color }}
              />
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
