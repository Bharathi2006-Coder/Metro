/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SimulationParameters,
  TelemetryPoint,
  PresetScenario,
} from './types/simulation';
import {
  calculateRiskAssessment,
  generateDynamicAlerts,
  getMitigationRecommendations,
  PRESET_SCENARIOS,
} from './utils/riskEngine';
import { Header } from './components/Header';
import { TunnelVisualization } from './components/TunnelVisualization';
import { InputControls } from './components/InputControls';
import { RiskScoreCard } from './components/RiskScoreCard';
import { AlertBanner } from './components/AlertBanner';
import { MitigationRecommendations } from './components/MitigationRecommendations';
import { MonitoringChart } from './components/MonitoringChart';
import { PresetScenarios } from './components/PresetScenarios';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AlgorithmExplainerModal } from './components/AlgorithmExplainerModal';
import { RunInstructionsModal } from './components/RunInstructionsModal';

const DEFAULT_PARAMS: SimulationParameters = {
  groundwaterLevel: 'normal',
  leakageIntensity: 'none',
  drainageStatus: 'normal',
  soilCondition: 'stable',
  isPumpRunning: false,
  waterAccumulationCm: 0,
};

export default function App() {
  const [params, setParams] = useState<SimulationParameters>(DEFAULT_PARAMS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('normal');
  const [isInspectingDrainage, setIsInspectingDrainage] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Modals
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);
  const [showAlgorithm, setShowAlgorithm] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Telemetry Time-Series History
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(() => {
    const initial: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 10; i >= 1; i--) {
      initial.push({
        timeStep: 11 - i,
        timestamp: new Date(now - i * 5000).toLocaleTimeString(),
        groundwaterDepthM: -12.0,
        inflowRateLpm: 0,
        accumulatedWaterCm: 0,
        riskScore: 18,
      });
    }
    return initial;
  });

  // Calculate current risk & alerts
  const riskAssessment = calculateRiskAssessment(params);
  const alerts = generateDynamicAlerts(params, riskAssessment);
  const recommendations = getMitigationRecommendations(params, riskAssessment);

  // Audio tone generator using Web Audio API for industrial SCADA cues
  const playAlertSound = useCallback((frequency = 440, type: OscillatorType = 'sine', duration = 0.2) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext not allowed or muted
    }
  }, [soundEnabled]);

  // Play audio alert when high or critical alert condition changes
  const prevRiskCategory = useRef(riskAssessment.category);
  useEffect(() => {
    if (prevRiskCategory.current !== riskAssessment.category) {
      if (riskAssessment.category === 'CRITICAL RISK') {
        playAlertSound(784, 'square', 0.4);
      } else if (riskAssessment.category === 'HIGH RISK') {
        playAlertSound(587, 'triangle', 0.3);
      }
      prevRiskCategory.current = riskAssessment.category;
    }
  }, [riskAssessment.category, playAlertSound]);

  // Depth mapping for telemetry chart
  const getDepthMeters = (gw: SimulationParameters['groundwaterLevel']): number => {
    switch (gw) {
      case 'low': return -18.0;
      case 'normal': return -12.0;
      case 'high': return -6.0;
      case 'critical': return -2.0;
    }
  };

  // Flow mapping for telemetry
  const getInflowLpm = (leak: SimulationParameters['leakageIntensity']): number => {
    switch (leak) {
      case 'none': return 0;
      case 'low': return 8;
      case 'moderate': return 35;
      case 'high': return 90;
      case 'severe': return 220;
    }
  };

  // Automated Invert Water Ponding Dynamics & Telemetry Stream (1-second tick)
  useEffect(() => {
    const interval = setInterval(() => {
      setParams((prev) => {
        const inflowLpm = getInflowLpm(prev.leakageIntensity);
        // Rate of water accumulation in invert (cm per sec)
        const inflowCmPerSec = inflowLpm > 0 ? (inflowLpm / 100) * 1.5 : 0;

        // Dewatering pump discharge rate (cm per sec)
        let pumpDischargeCmPerSec = 0;
        if (prev.isPumpRunning) {
          if (prev.drainageStatus === 'normal') {
            pumpDischargeCmPerSec = 2.4;
          } else if (prev.drainageStatus === 'partial_blocked') {
            pumpDischargeCmPerSec = 0.9;
          } else {
            // Blocked or failed pump
            pumpDischargeCmPerSec = 0;
          }
        }

        const netRate = inflowCmPerSec - pumpDischargeCmPerSec;
        const newAccumulation = Math.max(0, Math.min(60, prev.waterAccumulationCm + netRate));

        return {
          ...prev,
          waterAccumulationCm: Number(newAccumulation.toFixed(1)),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Record Telemetry Step periodically or on input change
  const appendTelemetryStep = useCallback(() => {
    setTelemetryHistory((prev) => {
      const lastStep = prev.length > 0 ? prev[prev.length - 1].timeStep : 0;
      const newPoint: TelemetryPoint = {
        timeStep: lastStep + 1,
        timestamp: new Date().toLocaleTimeString(),
        groundwaterDepthM: getDepthMeters(params.groundwaterLevel),
        inflowRateLpm: getInflowLpm(params.leakageIntensity),
        accumulatedWaterCm: params.waterAccumulationCm,
        riskScore: riskAssessment.score,
      };
      return [...prev.slice(-14), newPoint];
    });
  }, [params.groundwaterLevel, params.leakageIntensity, params.waterAccumulationCm, riskAssessment.score]);

  // Trigger telemetry logging every 3 seconds or on state changes
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      appendTelemetryStep();
    }, 3000);
    return () => clearInterval(telemetryInterval);
  }, [appendTelemetryStep]);

  // Parameter Change Handler
  const handleParamChange = (updated: Partial<SimulationParameters>) => {
    setParams((prev) => ({
      ...prev,
      ...updated,
    }));
    setActiveScenarioId('');
  };

  // Mitigation Action: Activate Simulated Pump
  const handleActivatePump = () => {
    setParams((prev) => ({
      ...prev,
      isPumpRunning: true,
    }));
    playAlertSound(523, 'sine', 0.15);
  };

  // Mitigation Action: Stop Pump
  const handleStopPump = () => {
    setParams((prev) => ({
      ...prev,
      isPumpRunning: false,
    }));
  };

  // Mitigation Action: Inspect Drainage
  const handleInspectDrainage = () => {
    setIsInspectingDrainage(true);
    playAlertSound(659, 'sine', 0.2);

    setTimeout(() => {
      setIsInspectingDrainage(false);
      // Clears blockage if partial or full, repairs pump
      setParams((prev) => ({
        ...prev,
        drainageStatus: 'normal',
      }));
    }, 1800);
  };

  // Mitigation Action: Simulate Emergency
  const handleSimulateEmergency = () => {
    setParams({
      groundwaterLevel: 'critical',
      leakageIntensity: 'severe',
      drainageStatus: 'pump_failure',
      soilCondition: 'possible_erosion',
      isPumpRunning: false,
      waterAccumulationCm: 28.5,
    });
    setActiveScenarioId('heavy-ingress');
    playAlertSound(880, 'sawtooth', 0.5);
  };

  // Mitigation Action: Reset Simulation
  const handleResetSimulation = () => {
    setParams(DEFAULT_PARAMS);
    setActiveScenarioId('normal');
    playAlertSound(440, 'sine', 0.15);
  };

  // Preset Scenario Selection
  const handleSelectScenario = (scenario: PresetScenario) => {
    setActiveScenarioId(scenario.id);
    setParams((prev) => ({
      ...prev,
      ...scenario.parameters,
      isPumpRunning: scenario.id === 'heavy-ingress' ? true : prev.isPumpRunning,
      waterAccumulationCm: scenario.id === 'drainage-failure' ? 18.0 : scenario.id === 'heavy-ingress' ? 12.0 : 0,
    }));
    playAlertSound(600, 'sine', 0.15);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* SECTION 1: DASHBOARD HEADER */}
      <Header
        onReset={handleResetSimulation}
        onOpenHowItWorks={() => setShowHowItWorks(true)}
        onOpenAlgorithm={() => setShowAlgorithm(true)}
        onOpenInstructions={() => setShowInstructions(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Dynamic Contextual Alert Banner (Section 5) */}
        <AlertBanner alerts={alerts} />

        {/* TOP SPLIT: Tunnel Cross-Section Visualization & Risk Assessment Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* SECTION 2: TUNNEL VISUALIZATION (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <TunnelVisualization
              groundwaterLevel={params.groundwaterLevel}
              leakageIntensity={params.leakageIntensity}
              drainageStatus={params.drainageStatus}
              soilCondition={params.soilCondition}
              isPumpRunning={params.isPumpRunning}
              waterAccumulationCm={params.waterAccumulationCm}
            />
          </div>

          {/* SECTION 4: RISK ASSESSMENT ENGINE (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <RiskScoreCard assessment={riskAssessment} />
          </div>
        </div>

        {/* SECTION 3: INTERACTIVE INPUT CONTROLS */}
        <InputControls
          params={params}
          onChange={handleParamChange}
          onActivatePump={handleActivatePump}
          onStopPump={handleStopPump}
          onInspectDrainage={handleInspectDrainage}
          onSimulateEmergency={handleSimulateEmergency}
          onResetSimulation={handleResetSimulation}
          isInspectingDrainage={isInspectingDrainage}
        />

        {/* BOTTOM SPLIT: Mitigation Recommendation Engine & Real-Time Monitoring Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* SECTION 6: MITIGATION RECOMMENDATION ENGINE (6 Columns) */}
          <div className="lg:col-span-6 flex flex-col">
            <MitigationRecommendations recommendations={recommendations} />
          </div>

          {/* SECTION 8: MONITORING CHART (6 Columns) */}
          <div className="lg:col-span-6 flex flex-col">
            <MonitoringChart
              history={telemetryHistory}
              currentIngressRate={getInflowLpm(params.leakageIntensity)}
              currentGwDepth={getDepthMeters(params.groundwaterLevel)}
              currentPondingCm={params.waterAccumulationCm}
              onAdvanceStep={appendTelemetryStep}
            />
          </div>
        </div>

        {/* SECTION 9: 5 HACKATHON TEST PRESET SCENARIOS */}
        <PresetScenarios
          currentScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
        />

        {/* SECTION 10 & 11: PRESENTATION FOOTER & DISCLAIMER */}
        <footer className="pt-4 pb-8 border-t border-slate-800/80 text-xs text-slate-400 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200">
                Civil Engineering Hackathon 2026 — Metro Underground Excavation Module
              </span>
              <p className="text-[11px] text-slate-400">
                Built with React, TypeScript, SVG Computer-Aided Graphics & Tailwind CSS. Zero external API dependencies.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <span>Station: Section T-01</span>
              <span>·</span>
              <span>Chainage: 14+320.00</span>
              <span>·</span>
              <span>EPBM Ø 6.5m</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">IMPORTANT HACKATHON DISCLAIMER: </strong>
            This web application is an educational simulation created for student hackathon demonstration using illustrative mathematical models. It is not a certified geotechnical prediction software and must not be used for actual excavation, tunneling, or structural safety decision-making on active construction sites. Real underground works require calibrated piezometers, formal geological investigation, licensed geotechnical engineering oversight, and approved Eurocode / CIRIA site safety procedures.
          </div>
        </footer>
      </main>

      {/* Presentation Modals */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />

      <AlgorithmExplainerModal
        isOpen={showAlgorithm}
        onClose={() => setShowAlgorithm(false)}
      />

      <RunInstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </div>
  );
}
