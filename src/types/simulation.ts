/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GroundwaterLevel = 'low' | 'normal' | 'high' | 'critical';

export type LeakageIntensity = 'none' | 'low' | 'moderate' | 'high' | 'severe';

export type DrainageStatus =
  | 'normal'
  | 'partial_blocked'
  | 'pump_failure'
  | 'blocked';

export type SoilCondition =
  | 'stable'
  | 'moisture_increasing'
  | 'possible_erosion';

export type PumpStatus = 'idle' | 'running' | 'failed' | 'disabled';

export type RiskCategory =
  | 'LOW RISK'
  | 'MODERATE RISK'
  | 'HIGH RISK'
  | 'CRITICAL RISK';

export interface TelemetryPoint {
  timeStep: number;
  timestamp: string;
  groundwaterDepthM: number; // meters below ground level (e.g. -18, -12, -6, -2)
  inflowRateLpm: number;     // liters per minute
  accumulatedWaterCm: number;// water ponding depth in invert (cm)
  riskScore: number;
}

export interface SimulationParameters {
  groundwaterLevel: GroundwaterLevel;
  leakageIntensity: LeakageIntensity;
  drainageStatus: DrainageStatus;
  soilCondition: SoilCondition;
  isPumpRunning: boolean;
  waterAccumulationCm: number; // calculated simulated invert water depth (0 to 60 cm)
}

export interface RiskBreakdown {
  groundwaterPoints: number;
  leakagePoints: number;
  drainagePoints: number;
  soilPoints: number;
  pumpMitigationOffset: number;
  rawSum: number;
  finalScore: number;
}

export interface RiskAssessment {
  score: number;
  category: RiskCategory;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    accentHex: string;
  };
  factors: string[];
  groundwaterCondition: string;
  drainageCondition: string;
  recommendedAction: string;
  breakdown: RiskBreakdown;
}

export interface DynamicAlert {
  id: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  explanation: string;
  suggestedAction: string;
  iconType: 'shield-check' | 'alert-triangle' | 'alert-circle' | 'flame' | 'droplet';
}

export interface MitigationRecommendation {
  id: string;
  title: string;
  priority: 'ROUTINE' | 'ELEVATED' | 'URGENT' | 'EMERGENCY';
  geotechnicalContext: string;
  actionSteps: string[];
  equipmentOrTool: string;
}

export interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  parameters: {
    groundwaterLevel: GroundwaterLevel;
    leakageIntensity: LeakageIntensity;
    drainageStatus: DrainageStatus;
    soilCondition: SoilCondition;
  };
  keyTakeaway: string;
}
