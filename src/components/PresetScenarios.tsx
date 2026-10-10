/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PRESET_SCENARIOS } from '../utils/riskEngine';
import { PresetScenario } from '../types/simulation';
import { PlaySquare, Check, Sparkles, AlertTriangle } from 'lucide-react';

interface PresetScenariosProps {
  currentScenarioId?: string;
  onSelectScenario: (scenario: PresetScenario) => void;
}

export const PresetScenarios: React.FC<PresetScenariosProps> = ({
  currentScenarioId,
  onSelectScenario,
}) => {
  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <PlaySquare className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
            Curated Hackathon Test Scenarios (5 Presets)
          </h2>
        </div>
        <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
          ONE-CLICK VERIFICATION BENCHMARK
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Click any scenario below to automatically populate the simulated parameters, update the cross-section elevation, compute the risk score, and generate contextual recommendations.
      </p>

      {/* Preset scenario cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
        {PRESET_SCENARIOS.map((sc) => {
          const isSelected = currentScenarioId === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelectScenario(sc)}
              className={`flex flex-col justify-between p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'bg-slate-850 text-slate-400'
                    }`}
                  >
                    {sc.badge}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </div>

                <h3 className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {sc.name}
                </h3>

                <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-3 leading-snug">
                  {sc.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-cyan-300/80 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">Load Test Preset</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
