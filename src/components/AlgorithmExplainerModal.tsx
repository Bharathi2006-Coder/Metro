/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Calculator, Table, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AlgorithmExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmExplainerModal: React.FC<AlgorithmExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Technical Specification: Risk Scoring Algorithm
              </h2>
              <span className="text-xs text-cyan-300 font-mono">
                Documented Formula, Weights & Mathematical Invariants
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mathematical Equation */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
            Governing Equation
          </span>
          <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-xs sm:text-sm font-mono text-cyan-300 text-center font-bold">
            Risk Score = Clamp(GW_Base + Leakage + Drainage_Penalty + Soil_Erosion - Pump_Offset, 0, 100)
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The function maps discrete environmental states into an additive risk composite, bounded within the interval [0, 100]. Every component has a direct civil engineering rationale based on tunnel hydrostatic loading and drainage conveyance mechanics.
          </p>
        </div>

        {/* Weights Matrix Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5" />
            <span>Weight Assignment Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2 px-3">Variable</th>
                  <th className="py-2 px-3">Parameter Value</th>
                  <th className="py-2 px-3">Simulated Physical State</th>
                  <th className="py-2 px-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="bg-slate-950/40">
                  <td className="py-2 px-3 font-semibold text-cyan-400">Groundwater Level</td>
                  <td className="py-2 px-3">Low</td>
                  <td className="py-2 px-3 text-slate-400">-18m (Beneath tunnel invert slab)</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">+8</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="py-2 px-3 font-semibold text-cyan-400">Groundwater Level</td>
                  <td className="py-2 px-3">Normal</td>
                  <td className="py-2 px-3 text-slate-400">-12m (Mid-height springline)</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">+18</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="py-2 px-3 font-semibold text-cyan-400">Groundwater Level</td>
                  <td className="py-2 px-3">High</td>
                  <td className="py-2 px-3 text-slate-400">-6m (Exceeding tunnel crown)</td>
                  <td className="py-2 px-3 text-right text-amber-400 font-bold">+38</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="py-2 px-3 font-semibold text-cyan-400">Groundwater Level</td>
                  <td className="py-2 px-3">Critical</td>
                  <td className="py-2 px-3 text-slate-400">-2m (Surface hydrostatic surcharge)</td>
                  <td className="py-2 px-3 text-right text-rose-400 font-bold">+48</td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-semibold text-blue-400">Leakage Intensity</td>
                  <td className="py-2 px-3">None</td>
                  <td className="py-2 px-3 text-slate-400">0 L/min (Impermeable dry joints)</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">+0</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-blue-400">Leakage Intensity</td>
                  <td className="py-2 px-3">Low</td>
                  <td className="py-2 px-3 text-slate-400">8 L/min (Damp joint weeping)</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">+10</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-blue-400">Leakage Intensity</td>
                  <td className="py-2 px-3">Moderate</td>
                  <td className="py-2 px-3 text-slate-400">35 L/min (Continuous joint trickle)</td>
                  <td className="py-2 px-3 text-right text-yellow-400 font-bold">+22</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-blue-400">Leakage Intensity</td>
                  <td className="py-2 px-3">High</td>
                  <td className="py-2 px-3 text-slate-400">90 L/min (Active pressure jet)</td>
                  <td className="py-2 px-3 text-right text-amber-400 font-bold">+36</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-blue-400">Leakage Intensity</td>
                  <td className="py-2 px-3">Severe</td>
                  <td className="py-2 px-3 text-slate-400">220 L/min (Massive gushing ingress)</td>
                  <td className="py-2 px-3 text-right text-rose-400 font-bold">+48</td>
                </tr>

                <tr className="bg-slate-950/40">
                  <td className="py-2 px-3 font-semibold text-amber-400">Drainage Status</td>
                  <td className="py-2 px-3">Operating Normally</td>
                  <td className="py-2 px-3 text-slate-400">100% Gravity sump discharge</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">+0</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="py-2 px-3 font-semibold text-amber-400">Drainage Status</td>
                  <td className="py-2 px-3">Partially Blocked</td>
                  <td className="py-2 px-3 text-slate-400">~50% Siltation in invert trench</td>
                  <td className="py-2 px-3 text-right text-amber-400 font-bold">+16</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="py-2 px-3 font-semibold text-amber-400">Drainage Status</td>
                  <td className="py-2 px-3">Pump Failure</td>
                  <td className="py-2 px-3 text-slate-400">Primary pump motor tripped offline</td>
                  <td className="py-2 px-3 text-right text-rose-400 font-bold">+28</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="py-2 px-3 font-semibold text-amber-400">Drainage Status</td>
                  <td className="py-2 px-3">Drainage Blocked</td>
                  <td className="py-2 px-3 text-slate-400">Zero discharge; invert flooding imminent</td>
                  <td className="py-2 px-3 text-right text-rose-400 font-bold">+35</td>
                </tr>

                <tr>
                  <td className="py-2 px-3 font-semibold text-rose-400">Soil Condition</td>
                  <td className="py-2 px-3">Stable</td>
                  <td className="py-2 px-3 text-slate-400">Intact confining soil matrix</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">+0</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-rose-400">Soil Condition</td>
                  <td className="py-2 px-3">Moisture Increasing</td>
                  <td className="py-2 px-3 text-slate-400">Pore pressure saturation build-up</td>
                  <td className="py-2 px-3 text-right text-yellow-400 font-bold">+12</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-rose-400">Soil Condition</td>
                  <td className="py-2 px-3">Possible Soil Erosion</td>
                  <td className="py-2 px-3 text-slate-400">Internal piping / loss of fines</td>
                  <td className="py-2 px-3 text-right text-rose-400 font-bold">+25</td>
                </tr>

                <tr className="bg-cyan-950/30">
                  <td className="py-2 px-3 font-semibold text-cyan-300">Active Mitigation</td>
                  <td className="py-2 px-3">Pump Active (Normal Trench)</td>
                  <td className="py-2 px-3 text-slate-400">Active dewatering drawdown</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">-22</td>
                </tr>
                <tr className="bg-cyan-950/30">
                  <td className="py-2 px-3 font-semibold text-cyan-300">Active Mitigation</td>
                  <td className="py-2 px-3">Pump Active (Partial Trench)</td>
                  <td className="py-2 px-3 text-slate-400">Throttled dewatering drawdown</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">-10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Demo Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
            <span className="text-emerald-400 font-bold block">0–29: LOW RISK</span>
            <span className="text-[11px] text-slate-300">Nominal baseline. Routine shift records.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-yellow-950/40 border border-yellow-500/40">
            <span className="text-yellow-400 font-bold block">30–59: MODERATE RISK</span>
            <span className="text-[11px] text-slate-300">Heightened monitoring; inspect joints.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40">
            <span className="text-amber-400 font-bold block">60–79: HIGH RISK</span>
            <span className="text-[11px] text-slate-300">Mobilize grouting crew & dewatering backup.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40">
            <span className="text-rose-400 font-bold block">80–100: CRITICAL RISK</span>
            <span className="text-[11px] text-slate-300">Execute emergency site safety protocols.</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>ENGINEERING ACCREDITATION DISCLAIMER:</strong> These category boundaries and point values are designed for hackathon student presentations. They do not constitute official BS EN 1997 / Eurocode 7 standards, British Standards, or contractually certified metro safety limits.
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
