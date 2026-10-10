/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MitigationRecommendation } from '../types/simulation';
import {
  ClipboardCheck,
  CheckCircle,
  AlertCircle,
  Wrench,
  ShieldCheck,
  HardHat,
  Info,
  ChevronRight,
} from 'lucide-react';

interface MitigationRecommendationsProps {
  recommendations: MitigationRecommendation[];
  onActionComplete?: (id: string) => void;
}

export const MitigationRecommendations: React.FC<MitigationRecommendationsProps> = ({
  recommendations,
  onActionComplete,
}) => {
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (recId: string, stepIndex: number) => {
    const key = `${recId}-${stepIndex}`;
    setCompletedActions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getPriorityStyle = (priority: MitigationRecommendation['priority']) => {
    switch (priority) {
      case 'EMERGENCY':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          indicator: 'bg-rose-500',
        };
      case 'URGENT':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          indicator: 'bg-amber-500',
        };
      case 'ELEVATED':
        return {
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          indicator: 'bg-yellow-400',
        };
      case 'ROUTINE':
      default:
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          indicator: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HardHat className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
            Mitigation Recommendation Engine ({recommendations.length})
          </h2>
        </div>
        <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
          SITE INTERVENTION MATRIX
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Rule-based action protocols matching current hydrostatic pore pressure, joint seepage rates, and invert drainage status.
      </p>

      {/* Recommendations Cards List */}
      <div className="space-y-3">
        {recommendations.map((rec) => {
          const pStyle = getPriorityStyle(rec.priority);
          return (
            <div
              key={rec.id}
              className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5 space-y-2.5 transition-all hover:border-slate-700"
            >
              {/* Card Title & Priority */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${pStyle.indicator} shrink-0`} />
                  <h3 className="text-xs font-bold text-slate-200">
                    {rec.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${pStyle.badge}`}
                  >
                    {rec.priority}
                  </span>
                </div>
              </div>

              {/* Geotechnical Context Note */}
              <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800/80 leading-relaxed">
                <strong className="text-slate-300">Engineering Rationale: </strong>
                {rec.geotechnicalContext}
              </p>

              {/* Step-by-Step Action Items */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Action Steps Checklist:
                </span>
                {rec.actionSteps.map((step, idx) => {
                  const key = `${rec.id}-${idx}`;
                  const isChecked = !!completedActions[key];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleAction(rec.id, idx)}
                      className={`flex items-start gap-2.5 w-full text-left p-1.5 rounded transition-colors text-xs ${
                        isChecked
                          ? 'bg-emerald-950/30 text-emerald-300 line-through opacity-75'
                          : 'bg-slate-900/50 hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'border-slate-600 bg-slate-950'
                        }`}
                      >
                        {isChecked && <CheckCircle className="w-2.5 h-2.5" />}
                      </div>
                      <span className="leading-snug">{step}</span>
                    </button>
                  );
                })}
              </div>

              {/* Required Equipment Tag */}
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-cyan-400/90 font-mono">
                <Wrench className="w-3 h-3 text-cyan-500 shrink-0" />
                <span>Tool / Equipment: {rec.equipmentOrTool}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Safety Role Disclaimer */}
      <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong>DISCLAIMER ON DECISION AUTONOMY:</strong> This simulation provides educational recommendations for civil engineering hackathon demonstrations. It does NOT certify tunnel structural safety, nor autonomously replace real-world geotechnical assessment, calibrated instrumentation, or approved shift safety protocols.
        </span>
      </div>
    </div>
  );
};
