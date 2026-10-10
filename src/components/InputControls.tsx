/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GroundwaterLevel,
  LeakageIntensity,
  DrainageStatus,
  SoilCondition,
  SimulationParameters,
} from '../types/simulation';
import {
  Sliders,
  Play,
  Square,
  Wrench,
  AlertOctagon,
  RotateCcw,
  Droplets,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface InputControlsProps {
  params: SimulationParameters;
  onChange: (updated: Partial<SimulationParameters>) => void;
  onActivatePump: () => void;
  onStopPump: () => void;
  onInspectDrainage: () => void;
  onSimulateEmergency: () => void;
  onResetSimulation: () => void;
  isInspectingDrainage?: boolean;
}

export const InputControls: React.FC<InputControlsProps> = ({
  params,
  onChange,
  onActivatePump,
  onStopPump,
  onInspectDrainage,
  onSimulateEmergency,
  onResetSimulation,
  isInspectingDrainage,
}) => {
  const groundwaterOptions: { id: GroundwaterLevel; label: string; depth: string; desc: string }[] = [
    { id: 'low', label: 'Low', depth: '-18.0m', desc: 'Beneath invert' },
    { id: 'normal', label: 'Normal', depth: '-12.0m', desc: 'Springline' },
    { id: 'high', label: 'High', depth: '-6.0m', desc: 'Above crown' },
    { id: 'critical', label: 'Critical', depth: '-2.0m', desc: 'Surcharge' },
  ];

  const leakageOptions: { id: LeakageIntensity; label: string; rate: string; desc: string }[] = [
    { id: 'none', label: 'None', rate: '0 L/min', desc: 'Dry joints' },
    { id: 'low', label: 'Low', rate: '8 L/min', desc: 'Damp weep' },
    { id: 'moderate', label: 'Moderate', rate: '35 L/min', desc: 'Trickle' },
    { id: 'high', label: 'High', rate: '90 L/min', desc: 'Steady jet' },
    { id: 'severe', label: 'Severe', rate: '220 L/min', desc: 'Gushing' },
  ];

  const drainageOptions: { id: DrainageStatus; label: string; desc: string; penalty: string }[] = [
    { id: 'normal', label: 'Operating Normally', desc: 'Clean trench & 100% sump gravity outflow', penalty: '0 pts' },
    { id: 'partial_blocked', label: 'Partially Blocked', desc: 'Silt deposition restricting ~50% conveyance', penalty: '+16 pts' },
    { id: 'pump_failure', label: 'Pump Failure', desc: 'Submersible pump motor trip / electrical loss', penalty: '+28 pts' },
    { id: 'blocked', label: 'Drainage Blocked', desc: 'Full sediment choke; water ponding in invert', penalty: '+35 pts' },
  ];

  const soilOptions: { id: SoilCondition; label: string; desc: string; penalty: string }[] = [
    { id: 'stable', label: 'Stable', desc: 'Intact confining clay/silt matrix without voiding', penalty: '0 pts' },
    { id: 'moisture_increasing', label: 'Moisture Increasing', desc: 'Pore pressure elevation and soil matrix softening', penalty: '+12 pts' },
    { id: 'possible_erosion', label: 'Possible Soil Erosion', desc: 'Active loss of fines (internal piping/cavitation)', penalty: '+25 pts' },
  ];

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
            Interactive Simulation Controls
          </h2>
        </div>
        <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
          LIVE PARAMETER DISPATCH
        </span>
      </div>

      {/* Control A: Groundwater Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>A. Groundwater Hydrostatic Level</span>
          </label>
          <span className="text-[11px] font-mono text-cyan-300">
            Selected: <span className="font-bold uppercase">{params.groundwaterLevel}</span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {groundwaterOptions.map((opt) => {
            const isSelected = params.groundwaterLevel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ groundwaterLevel: opt.id })}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-sm shadow-cyan-900/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {opt.label}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{opt.depth}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control B: Water Leakage Intensity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>B. Water Leakage Intensity (Joint J-04)</span>
          </label>
          <span className="text-[11px] font-mono text-blue-300">
            Selected: <span className="font-bold uppercase">{params.leakageIntensity}</span>
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
          {leakageOptions.map((opt) => {
            const isSelected = params.leakageIntensity === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ leakageIntensity: opt.id })}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-950/80 border-blue-400 text-white shadow-sm shadow-blue-900/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className={`text-xs font-semibold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                  {opt.label}
                </span>
                <span className="font-mono text-[10px] text-cyan-400 mt-0.5">{opt.rate}</span>
                <span className="text-[10px] text-slate-400 leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control C: Drainage System Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>C. Drainage System Status</span>
          </label>
          <span className="text-[11px] font-mono text-amber-300">
            Selected: <span className="font-bold">{params.drainageStatus.replace('_', ' ').toUpperCase()}</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {drainageOptions.map((opt) => {
            const isSelected = params.drainageStatus === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ drainageStatus: opt.id })}
                className={`flex items-start justify-between p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-950/70 border-amber-400 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-semibold ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{opt.desc}</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 shrink-0 ml-2">
                  {opt.penalty}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control D: Soil Condition */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>D. Surrounding Soil Stratum Condition</span>
          </label>
          <span className="text-[11px] font-mono text-rose-300">
            Selected: <span className="font-bold">{params.soilCondition.replace('_', ' ').toUpperCase()}</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {soilOptions.map((opt) => {
            const isSelected = params.soilCondition === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ soilCondition: opt.id })}
                className={`flex flex-col justify-between p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-rose-950/70 border-rose-400 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-rose-200' : 'text-slate-200'}`}>
                    {opt.label}
                  </span>
                  <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    {opt.penalty}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control E: Mitigation Action Controls */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>E. Simulated Active Mitigation Controls</span>
          </label>
          <span className="text-[11px] text-slate-400">Click to execute simulated field actions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* 1. Simulated Pump Activation */}
          {params.isPumpRunning ? (
            <button
              type="button"
              onClick={onStopPump}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-xs bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 transition-colors shadow-sm"
              title="Stop simulated dewatering pump P-101"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Pump</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onActivatePump}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-xs bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400 transition-colors shadow-md shadow-cyan-900/40"
              title="Activate simulated dewatering pump P-101"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Activate Simulated Pump</span>
            </button>
          )}

          {/* 2. Inspect Drainage */}
          <button
            type="button"
            onClick={onInspectDrainage}
            disabled={isInspectingDrainage}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-xs border transition-colors ${
              isInspectingDrainage
                ? 'bg-amber-950/80 border-amber-500 text-amber-200 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title="Inspect drainage channels & clear siltation"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isInspectingDrainage ? 'Inspecting Trench...' : 'Inspect Drainage'}</span>
          </button>

          {/* 3. Simulate Emergency Ingress */}
          <button
            type="button"
            onClick={onSimulateEmergency}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-xs bg-red-950/70 hover:bg-red-900/80 text-rose-200 border border-rose-700/60 hover:border-rose-500 transition-colors"
            title="Simulate sudden emergency high water ingress & pump trip"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Emergency</span>
          </button>

          {/* 4. Reset Simulation */}
          <button
            type="button"
            onClick={onResetSimulation}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Restore default nominal baseline parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>
        </div>

        {/* Pump status feedback notice */}
        {params.isPumpRunning && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>
                Simulated Pump P-101 is <strong className="text-cyan-300">ACTIVE</strong>.
                {params.drainageStatus === 'blocked' || params.drainageStatus === 'pump_failure'
                  ? ' Warning: Discharge blocked or pump fault detected! Dewatering is throttled.'
                  : ' Water drawdown in progress toward collection sump pit.'}
              </span>
            </div>
            <span className="font-mono text-cyan-400 text-[10px]">Q_eff: {params.drainageStatus === 'normal' ? '120 m³/h' : params.drainageStatus === 'partial_blocked' ? '45 m³/h' : '0 m³/h'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
