import type {
  ParameterConfig,
  ParameterValue,
  DomainConfig,
  AnalysisResult,
  Severity,
  Trend,
  Alert,
  AlertLevel,
  XAIContribution,
  DecisionTier,
  ScenarioValues,
} from '@/types';

/**
 * Calculate penalty for a single parameter value
 * Implements the exact math from the spec:
 * - If value < safeMin → penalty = ((safeMin - value) / (safeMin - critMin)) × 100
 * - If value > safeMax → penalty = ((value - safeMax) / (critMax - safeMax)) × 100
 * - If within safe range → penalty = (|value - ideal| / halfRange) × 15
 * - Clamp all penalties to [0, 100]
 */
export function calculatePenalty(value: number, config: ParameterConfig): number {
  const { ideal, safeMin, safeMax, critMin, critMax } = config;

  let penalty: number;

  if (value < safeMin) {
    // Below safe range
    const denominator = safeMin - (critMin ?? config.min);
    penalty = denominator !== 0 ? ((safeMin - value) / denominator) * 100 : 100;
  } else if (value > safeMax) {
    // Above safe range
    const denominator = (critMax ?? config.max) - safeMax;
    penalty = denominator !== 0 ? ((value - safeMax) / denominator) * 100 : 100;
  } else {
    // Within safe range
    const halfRange = (safeMax - safeMin) / 2;
    penalty = halfRange !== 0 ? (Math.abs(value - ideal) / halfRange) * 15 : 0;
  }

  // Clamp to [0, 100]
  return Math.max(0, Math.min(100, penalty));
}

/**
 * Calculate Risk Index
 * R = Σ(wᵢ × penaltyᵢ) / Σ(wᵢ) bounded [0, 100]
 */
export function calculateRiskIndex(
  values: ParameterValue[],
  configs: ParameterConfig[]
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  values.forEach((pv) => {
    const config = configs.find((c) => c.id === pv.id);
    if (config) {
      weightedSum += config.weight * pv.penalty;
      totalWeight += config.weight;
    }
  });

  if (totalWeight === 0) return 0;

  const riskIndex = weightedSum / totalWeight;
  return Math.max(0, Math.min(100, riskIndex));
}

/**
 * Calculate XAI Contributions
 * Cᵢ = (penaltyᵢ / Σ penalties) × 100 (always sums to 100%)
 */
export function calculateXAIContributions(
  values: ParameterValue[],
  configs: ParameterConfig[]
): XAIContribution[] {
  const totalPenalty = values.reduce((sum, pv) => sum + pv.penalty, 0);

  return values
    .map((pv) => {
      const config = configs.find((c) => c.id === pv.id);
      return {
        parameterId: pv.id,
        parameterLabel: config?.label ?? pv.id,
        contribution: totalPenalty > 0 ? (pv.penalty / totalPenalty) * 100 : 0,
        penalty: pv.penalty,
      };
    })
    .sort((a, b) => b.contribution - a.contribution);
}

/**
 * Determine severity based on risk index
 * - info (safe): R < 20
 * - warning: R 20–64
 * - critical: R ≥ 65
 */
export function determineSeverity(riskIndex: number): Severity {
  if (riskIndex >= 65) return 'critical';
  if (riskIndex >= 20) return 'warning';
  return 'safe';
}

/**
 * Determine alert level for a parameter penalty
 * - INFO: penalty 15–19
 * - WARNING: penalty 20–59
 * - CRITICAL: penalty ≥ 60
 */
export function determineAlertLevel(penalty: number): AlertLevel | null {
  if (penalty >= 60) return 'CRITICAL';
  if (penalty >= 20) return 'WARNING';
  if (penalty >= 15) return 'INFO';
  return null;
}

/**
 * Generate alerts from parameter values
 */
export function generateAlerts(
  values: ParameterValue[],
  configs: ParameterConfig[],
  inputValues: Record<string, number>
): Alert[] {
  const alerts: Alert[] = [];

  values.forEach((pv) => {
    const level = determineAlertLevel(pv.penalty);
    if (level && level !== 'INFO') {
      const config = configs.find((c) => c.id === pv.id);
      if (config) {
        alerts.push({
          parameterId: pv.id,
          parameterLabel: config.label,
          level,
          penalty: pv.penalty,
          value: inputValues[pv.id] ?? 0,
          unit: config.unit,
        });
      }
    }
  });

  return alerts.sort((a, b) => b.penalty - a.penalty);
}

/**
 * Determine trend and forecast based on risk index
 * - R ≥ 65 → trend: Degrading, forecast: "Critical threshold exceeded..."
 * - R ≥ 20 → trend: Degrading, forecast: "Trending toward critical..."
 * - R ≥ 10 → trend: Stable, forecast: "Minor deviations..."
 * - R < 10 → trend: Improving, forecast: "All parameters optimal."
 */
export function determineTrendAndForecast(riskIndex: number): {
  trend: Trend;
  forecast: string;
} {
  if (riskIndex >= 65) {
    return {
      trend: 'Degrading',
      forecast: 'Critical threshold exceeded. Rapid deterioration expected.',
    };
  }
  if (riskIndex >= 20) {
    const hoursToThreshold = Math.max(1, Math.round((65 - riskIndex) / 5));
    return {
      trend: 'Degrading',
      forecast: `Trending toward critical. Estimated ${hoursToThreshold}h to threshold.`,
    };
  }
  if (riskIndex >= 10) {
    return {
      trend: 'Stable',
      forecast: 'Minor deviations. Monitor every 6h.',
    };
  }
  return {
    trend: 'Improving',
    forecast: 'All parameters optimal.',
  };
}

/**
 * Generate decision engine recommendations
 * - IMMEDIATE: only when severity = critical
 * - SHORT-TERM: when severity = warning or critical
 * - LONG-TERM: always present
 */
export function generateDecisions(
  severity: Severity,
  xaiContributions: XAIContribution[]
): DecisionTier[] {
  const decisions: DecisionTier[] = [];
  const topContributor = xaiContributions[0]?.parameterLabel ?? 'primary sensor';

  if (severity === 'critical') {
    decisions.push({
      tier: 'IMMEDIATE',
      actions: [
        `Investigate ${topContributor} immediately`,
        'Initiate emergency response protocol',
        'Alert on-call personnel',
      ],
    });
  }

  if (severity === 'warning' || severity === 'critical') {
    decisions.push({
      tier: 'SHORT-TERM',
      actions: [
        `Calibrate ${topContributor} sensor`,
        'Increase monitoring frequency to every 2h',
        'Review recent parameter trends',
      ],
    });
  }

  decisions.push({
    tier: 'LONG-TERM',
    actions: [
      'Schedule routine inspection within 30 days',
      'Review and update threshold configurations',
      'Evaluate sensor drift and calibration history',
    ],
  });

  return decisions;
}

/**
 * Calculate confidence score
 * Start at 100. Subtract:
 * - 15 per missing parameter
 * - 5 per parameter with penalty = 100 (fully clamped)
 * - 5 if riskIndex > 90
 * Clamp to [0, 100]
 */
export function calculateConfidence(
  values: ParameterValue[],
  expectedParams: number,
  riskIndex: number
): number {
  let confidence = 100;

  // Missing parameters
  const missingCount = expectedParams - values.length;
  confidence -= missingCount * 15;

  // Fully clamped penalties
  const clampedCount = values.filter((pv) => pv.penalty === 100).length;
  confidence -= clampedCount * 5;

  // High risk index
  if (riskIndex > 90) {
    confidence -= 5;
  }

  return Math.max(0, Math.min(100, confidence));
}

/**
 * Main analysis function - performs complete risk analysis
 */
export function analyzeRisk(
  inputValues: Record<string, number>,
  domainConfig: DomainConfig
): AnalysisResult {
  const { parameters } = domainConfig;

  // Calculate penalties for all parameters
  const parameterValues: ParameterValue[] = parameters.map((config) => ({
    id: config.id,
    value: inputValues[config.id] ?? config.ideal,
    penalty: calculatePenalty(inputValues[config.id] ?? config.ideal, config),
  }));

  // Calculate risk index
  const riskIndex = calculateRiskIndex(parameterValues, parameters);

  // Determine severity
  const severity = determineSeverity(riskIndex);

  // Calculate XAI contributions
  const xaiContributions = calculateXAIContributions(parameterValues, parameters);

  // Determine trend and forecast
  const { trend, forecast } = determineTrendAndForecast(riskIndex);

  // Generate alerts
  const alerts = generateAlerts(parameterValues, parameters, inputValues);

  // Generate decisions
  const decisions = generateDecisions(severity, xaiContributions);

  // Calculate confidence
  const confidence = calculateConfidence(
    parameterValues,
    parameters.length,
    riskIndex
  );

  return {
    riskIndex,
    severity,
    trend,
    forecast,
    confidence,
    alerts,
    xaiContributions,
    decisions,
  };
}

/**
 * Add randomized noise to scenario values for simulation
 */
export function addNoise(
  baseValues: ScenarioValues,
  noisePercent: number = 10
): ScenarioValues {
  const result: ScenarioValues = {};

  Object.entries(baseValues).forEach(([key, value]) => {
    const noise = (Math.random() - 0.5) * 2 * (value * noisePercent / 100);
    result[key] = value + noise;
  });

  return result;
}
