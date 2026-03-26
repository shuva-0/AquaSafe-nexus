'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { DomainType, AnalysisResult, ScenarioType } from '@/types';
import { domainConfigs, domainScenarios } from '@/lib/domains';
import { analyzeRisk, addNoise } from '@/lib/engine';
import { DomainTabs } from '@/components/domain-tabs';
import { ParameterSlider } from '@/components/parameter-slider';
import { RiskGauge } from '@/components/risk-gauge';
import { SeverityBadge } from '@/components/severity-badge';
import { TrendIndicator } from '@/components/trend-indicator';
import { AlertsList } from '@/components/alerts-list';
import { XAIBars } from '@/components/xai-bars';
import { DecisionPanel } from '@/components/decision-panel';
import { Button } from '@/components/ui/button';

export default function AnalyzePage() {
  const [activeDomain, setActiveDomain] = useState<DomainType>('water');
  const [values, setValues] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const domainConfig = domainConfigs[activeDomain];
  const scenarios: ScenarioType[] = ['normal', 'alert', 'critical'];

  // Initialize values when domain changes
  useEffect(() => {
    const initialValues: Record<string, number> = {};
    domainConfig.parameters.forEach((param) => {
      initialValues[param.id] = param.ideal;
    });
    setValues(initialValues);
    setResult(null);
  }, [activeDomain, domainConfig.parameters]);

  // Handle simulation
  useEffect(() => {
    if (isSimulating) {
      simulationRef.current = setInterval(() => {
        setScenarioIndex((prev) => {
          const nextIndex = (prev + 1) % scenarios.length;
          const scenarioType = scenarios[nextIndex];
          const baseValues = domainScenarios[activeDomain][scenarioType];
          const noisyValues = addNoise(baseValues, 8);
          setValues(noisyValues);

          // Auto-analyze during simulation
          const analysisResult = analyzeRisk(noisyValues, domainConfig);
          setResult(analysisResult);

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
  }, [isSimulating, activeDomain, domainConfig]);

  const handleValueChange = useCallback((parameterId: string, value: number) => {
    setValues((prev) => ({ ...prev, [parameterId]: value }));
  }, []);

  const handleAnalyze = useCallback(() => {
    const analysisResult = analyzeRisk(values, domainConfig);
    setResult(analysisResult);
  }, [values, domainConfig]);

  const handleSimulate = useCallback(() => {
    setIsSimulating((prev) => !prev);
  }, []);

  const handleDomainChange = useCallback((domain: DomainType) => {
    setIsSimulating(false);
    setActiveDomain(domain);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Domain Tabs */}
        <div className="mb-8">
          <DomainTabs
            activeDomain={activeDomain}
            onDomainChange={handleDomainChange}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Panel - Controls */}
          <div className="rounded-xl border border-slate-700 bg-[#1e293b] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {domainConfig.label} Parameters
              </h2>
              <div
                className="h-3 w-3 rounded-full animate-pulse"
                style={{ backgroundColor: domainConfig.color }}
              />
            </div>

            {/* Parameter Sliders */}
            <div className="mb-8 space-y-2">
              {domainConfig.parameters.map((param) => (
                <ParameterSlider
                  key={param.id}
                  config={param}
                  value={values[param.id] ?? param.ideal}
                  onChange={(value) => handleValueChange(param.id, value)}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAnalyze}
                className="flex-1 font-semibold"
                style={{
                  backgroundColor: domainConfig.color,
                  color: 'white',
                }}
                disabled={isSimulating}
              >
                ANALYZE
              </Button>
              <Button
                onClick={handleSimulate}
                variant={isSimulating ? 'destructive' : 'outline'}
                className="flex-1 font-semibold"
              >
                {isSimulating ? 'STOP' : 'SIMULATE'}
              </Button>
            </div>

            {isSimulating && (
              <div className="mt-4 text-center text-sm text-slate-400">
                Cycling through scenarios: {scenarios[scenarioIndex].toUpperCase()}
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Risk Gauge and Metrics */}
                <div className="rounded-xl border border-slate-700 bg-[#1e293b] p-6">
                  <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                    <RiskGauge
                      value={result.riskIndex}
                      severity={result.severity}
                    />
                    <div className="flex flex-col items-center gap-4 md:items-end">
                      <SeverityBadge severity={result.severity} size="lg" />
                      <TrendIndicator trend={result.trend} />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Confidence:</span>
                        <span className="font-mono text-lg font-semibold text-white">
                          {result.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Forecast */}
                  <div className="mt-6 rounded-lg bg-slate-800/50 p-4">
                    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Forecast
                    </h4>
                    <p className="text-sm text-slate-300">{result.forecast}</p>
                  </div>
                </div>

                {/* Alerts */}
                <div className="rounded-xl border border-slate-700 bg-[#1e293b] p-6">
                  <AlertsList alerts={result.alerts} />
                </div>

                {/* XAI Explainability */}
                <div className="rounded-xl border border-slate-700 bg-[#1e293b] p-6">
                  <XAIBars
                    contributions={result.xaiContributions}
                    domainColor={domainConfig.color}
                  />
                </div>

                {/* Decision Engine */}
                <div className="rounded-xl border border-slate-700 bg-[#1e293b] p-6">
                  <DecisionPanel decisions={result.decisions} />
                </div>
              </>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-xl border border-slate-700 bg-[#1e293b]">
                <div className="text-center">
                  <div className="mb-4 text-6xl text-slate-600">&#9711;</div>
                  <p className="text-slate-400">
                    Adjust parameters and click <strong>ANALYZE</strong>
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    or click <strong>SIMULATE</strong> to run automated scenarios
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
