/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RiskAssessment } from '../types/simulation';
import {
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  HelpCircle,
  Calculator,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RiskScoreCardProps {
  assessment: RiskAssessment;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ assessment }) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const { score, category, colorScheme, factors, groundwaterCondition, drainageCondition, recommendedAction, breakdown } = assessment;

  // Gauge needle or circumference for radial/meter
  // Score is 0 to 100. Let's create an accurate circular or arc meter!
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className={`flex flex-col rounded-xl border p-4 sm:p-5 shadow-xl transition-all ${colorScheme.bg} ${colorScheme.border}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-4 h-4 ${colorScheme.text}`} />
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
            Rule-Based Risk Assessment Engine
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-400">STATUS:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${colorScheme.badgeBg} ${colorScheme.badgeText}`}>
            {category}
          </span>
        </div>
      </div>

      {/* Main Score Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center py-4">
        {/* Left: Circular Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Meter */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background track circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />
              {/* Colored score arc */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={colorScheme.accentHex}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Score Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                {score}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className="text-center mt-2">
            <span className={`text-xs font-bold tracking-wider ${colorScheme.text}`}>
              {category}
            </span>
            <span className="block text-[10px] text-slate-400">
              {score < 30 ? '0–29: Nominal Safe' : score < 60 ? '30–59: Moderate Alert' : score < 80 ? '60–79: High Ingress' : '80–100: Critical Hazard'}
            </span>
          </div>
        </div>

        {/* Right: Geotechnical Factors & Summary */}
        <div className="md:col-span-8 space-y-3">
          {/* Key contributing factors */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Main Contributing Factors:
            </span>
            <ul className="space-y-1">
              {factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Environmental states summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block">HYDROSTATIC CONDITION</span>
              <span className="text-slate-200 font-mono text-[11px]">{groundwaterCondition}</span>
            </div>
            <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block">DRAINAGE CAPACITY</span>
              <span className="text-slate-200 font-mono text-[11px]">{drainageCondition}</span>
            </div>
          </div>

          {/* Recommended next action */}
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 uppercase">
              <ArrowRight className="w-3 h-3" />
              <span>Recommended Next Action:</span>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {recommendedAction}
            </p>
          </div>
        </div>
      </div>

      {/* Transparent Algorithm Accordion */}
      <div className="pt-2 border-t border-slate-800/80">
        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="flex items-center justify-between w-full py-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">Formula Breakdown & Weights Transparency</span>
          </div>
          {showFormulaDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFormulaDetails && (
          <div className="mt-2 p-3 bg-slate-950/90 rounded-lg border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
            <div className="text-[11px] text-cyan-400">
              Formula: Clamp(GW_Base + Leakage + Drainage_Penalty + Soil_Erosion - Pump_Offset, 0, 100)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-center pt-1 border-t border-slate-800">
              <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">GW Table</span>
                <span className="text-cyan-300 font-bold">+{breakdown.groundwaterPoints}</span>
              </div>
              <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Seepage Flow</span>
                <span className="text-blue-300 font-bold">+{breakdown.leakagePoints}</span>
              </div>
              <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Drainage Penalty</span>
                <span className="text-amber-300 font-bold">+{breakdown.drainagePoints}</span>
              </div>
              <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Soil Erosion</span>
                <span className="text-rose-300 font-bold">+{breakdown.soilPoints}</span>
              </div>
              <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Pump Offset</span>
                <span className="text-emerald-300 font-bold">-{breakdown.pumpMitigationOffset}</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 text-right">
              Raw Sum: <span className="text-white">{breakdown.rawSum}</span> → Net Score:{' '}
              <span className="text-cyan-400 font-bold">{breakdown.finalScore} / 100</span>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Engineering Disclaimer Box */}
      <div className="mt-3 p-2 bg-slate-950/60 rounded border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>EDUCATIONAL NOTICE:</strong> Illustrative demonstration scoring algorithm for hackathon simulation only.
          Thresholds (0–29 Low, 30–59 Moderate, 60–79 High, 80–100 Critical) are not certified geotechnical engineering limits or official metro safety standards.
        </span>
      </div>
    </div>
  );
};
