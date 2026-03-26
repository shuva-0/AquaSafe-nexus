// Domain types
export type DomainType = 'water' | 'infrastructure' | 'environment';

// Parameter configuration
export interface ParameterConfig {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  ideal: number;
  safeMin: number;
  safeMax: number;
  critMin?: number;
  critMax?: number;
  weight: number;
}

// Domain configuration
export interface DomainConfig {
  id: DomainType;
  label: string;
  color: string;
  parameters: ParameterConfig[];
}

// Parameter value with computed penalty
export interface ParameterValue {
  id: string;
  value: number;
  penalty: number;
}

// Alert levels
export type AlertLevel = 'INFO' | 'WARNING' | 'CRITICAL';

// Alert
export interface Alert {
  parameterId: string;
  parameterLabel: string;
  level: AlertLevel;
  penalty: number;
  value: number;
  unit: string;
}

// Severity levels
export type Severity = 'safe' | 'warning' | 'critical';

// Trend
export type Trend = 'Improving' | 'Stable' | 'Degrading';

// XAI Contribution
export interface XAIContribution {
  parameterId: string;
  parameterLabel: string;
  contribution: number;
  penalty: number;
}

// Decision tier
export interface DecisionTier {
  tier: 'IMMEDIATE' | 'SHORT-TERM' | 'LONG-TERM';
  actions: string[];
}

// Analysis result
export interface AnalysisResult {
  riskIndex: number;
  severity: Severity;
  trend: Trend;
  forecast: string;
  confidence: number;
  alerts: Alert[];
  xaiContributions: XAIContribution[];
  decisions: DecisionTier[];
}

// Simulation scenario
export type ScenarioType = 'normal' | 'alert' | 'critical';

// Scenario values
export interface ScenarioValues {
  [parameterId: string]: number;
}

// Domain scenarios
export interface DomainScenarios {
  normal: ScenarioValues;
  alert: ScenarioValues;
  critical: ScenarioValues;
}
