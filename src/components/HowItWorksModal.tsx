/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Target,
  Workflow,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
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
            <Target className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                How It Works — Urban Metro Groundwater Risk Mitigation
              </h2>
              <span className="text-xs text-cyan-300 font-mono">
                Civil Engineering Hackathon Educational Architecture
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

        {/* 1. Project Objectives */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>1. Core Project Objectives</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            During underground urban metro excavation (using Tunnel Boring Machines or NATM/SEM techniques), high groundwater levels create tremendous pore water pressure against the concrete segmental lining. Defective ring gaskets, rising aquifers, or blocked drainage sumps can precipitate tunnel invert flooding, soil loss of fines (internal piping), and catastrophic surface subsidence under buildings.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="font-semibold text-cyan-300 block mb-0.5">Interactive Sandbox</span>
              <p className="text-[11px] text-slate-400">Manipulate hydrostatic head, joint weeping, pump state, and soil erosion to observe live physical reactions.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="font-semibold text-cyan-300 block mb-0.5">Transparent Assessment</span>
              <p className="text-[11px] text-slate-400">Execute deterministic, rule-based risk calculations from 0 to 100 with documented engineering weightings.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="font-semibold text-cyan-300 block mb-0.5">Actionable Mitigation</span>
              <p className="text-[11px] text-slate-400">Receive precise civil engineering remediation protocols: chemical grouting, sump jetting, and backup pumps.</p>
            </div>
          </div>
        </div>

        {/* 2. 5-Step Risk Mitigation Workflow */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Workflow className="w-3.5 h-3.5" />
            <span>2. Geotechnical Risk Mitigation Workflow (5 Steps)</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-3 p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[11px] flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-white">Subsurface Sensing & Telemetry:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Vibrating wire piezometers measure aquifer pore pressure; acoustic meters record invert inflow rate (L/min); sump float switches detect ponding.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[11px] flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-white">Deterministic Risk Computation:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">The engine aggregates hydrostatic head points, leakage severity, drainage impairment penalties, and soil erosion factors to output an index from 0 to 100.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[11px] flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-white">Contextual Alert Dispatch:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Composite risk scenarios (e.g. High GW + Blocked Drainage or Silt Washout) trigger immediate color-coded alerts and audio cues.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[11px] flex items-center justify-center shrink-0">4</span>
              <div>
                <strong className="text-white">Simulated Active Dewatering Response:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Submersible pump P-101 engages automatically or manually, drawing down invert ponding and offsetting hydraulic risk points if drainage lines remain clear.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[11px] flex items-center justify-center shrink-0">5</span>
              <div>
                <strong className="text-white">Engineering Inspection & Verification:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Field engineers cross-check lining joint offsets, perform polyurethane chemical grouting, and survey surface settlement prisms (MP-01/02).</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Distinction: Simulated vs Real Sensor Data */}
        <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/40 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Distinction: Simulated Data vs. Real Geotechnical Instrumentation</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            In this interactive hackathon web application, values are generated locally using client-side mathematical models to demonstrate control logic and SCADA visualization.
            In a real urban metro project, data originates from physical hardware:
          </p>
          <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5 pl-1">
            <li><strong>Borehole Piezometers:</strong> Vibrating wire diaphragms converting frequency changes (Hz) to pore pressure (kPa).</li>
            <li><strong>Inflow Flowmeters:</strong> Ultrasonic Doppler and magnetic inductive meters on invert weir channels.</li>
            <li><strong>Surface Prisms:</strong> Automated Motorized Total Stations (AMTS) reading coordinates every 30 minutes to millimeter accuracy.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
