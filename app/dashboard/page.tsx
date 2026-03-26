'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { DomainType, AnalysisResult, ScenarioType } from '@/types';
import { domainConfigs, domainScenarios, domainList } from '@/lib/domains';
import { analyzeRisk, addNoise } from '@/lib/engine';
import { DomainCard } from '@/components/domain-card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [results, setResults] = useState<Record<DomainType, AnalysisResult | null>>({
    water: null,
    infrastructure: null,
    environment: null,
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenarios: ScenarioType[] = ['normal', 'alert', 'critical'];

  // Run analysis for all domains with current scenario
  const runAnalysis = useCallback((scenarioType: ScenarioType) => {
    const newResults: Record<DomainType, AnalysisResult | null> = {
      water: null,
      infrastructure: null,
      environment: null,
    };

    domainList.forEach((domain) => {
      const baseValues = domainScenarios[domain][scenarioType];
      const noisyValues = addNoise(baseValues, 8);
      newResults[domain] = analyzeRisk(noisyValues, domainConfigs[domain]);
    });

    setResults(newResults);
  }, []);

  // Handle simulation
  useEffect(() => {
    if (isSimulating) {
      // Run immediately on start
      runAnalysis(scenarios[scenarioIndex]);

      simulationRef.current = setInterval(() => {
        setScenarioIndex((prev) => {
          const nextIndex = (prev + 1) % scenarios.length;
          runAnalysis(scenarios[nextIndex]);
          return nextIndex;
        });
      }, 2200);
    } else {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
    }

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [isSimulating, runAnalysis, scenarioIndex]);

  const handleSimulate = useCallback(() => {
    setIsSimulating((prev) => !prev);
  }, []);

  // Calculate platform-wide average
  const validResults = Object.values(results).filter(
    (r): r is AnalysisResult => r !== null
  );
  const averageRisk =
    validResults.length > 0
      ? validResults.reduce((sum, r) => sum + r.riskIndex, 0) / validResults.length
      : null;

  const totalAlerts = validResults.reduce((sum, r) => sum + r.alerts.length, 0);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Platform Overview */}
        <div className="mb-8 rounded-xl border border-slate-700 bg-[#1e293b] p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Platform Overview
              </h2>
              <p className="text-sm text-slate-400">
                Real-time risk monitoring across all domains
              </p>
            </div>

            <div className="flex items-center gap-8">
              {/* Average Risk */}
              <div className="text-center">
                <div className="font-mono text-3xl font-bold text-white">
                  {averageRisk !== null ? averageRisk.toFixed(1) : '--'}
                </div>
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Avg Risk Index
                </div>
              </div>

              {/* Total Alerts */}
              <div className="text-center">
                <div className="font-mono text-3xl font-bold text-amber-400">
                  {totalAlerts}
                </div>
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Active Alerts
                </div>
              </div>

              {/* Simulate Button */}
              <Button
                onClick={handleSimulate}
                variant={isSimulating ? 'destructive' : 'default'}
                className="font-semibold"
              >
                {isSimulating ? 'STOP SIMULATION' : 'SIMULATE ALL'}
              </Button>
            </div>
          </div>

          {isSimulating && (
            <div className="mt-4 text-center text-sm text-slate-400">
              Cycling through scenarios: {scenarios[scenarioIndex].toUpperCase()}
            </div>
          )}
        </div>

        {/* Domain Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {domainList.map((domain) => (
            <DomainCard
              key={domain}
              config={domainConfigs[domain]}
              result={results[domain]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
