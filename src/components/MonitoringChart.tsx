/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TelemetryPoint } from '../types/simulation';
import { LineChart, BarChart2, Activity, RefreshCw } from 'lucide-react';

interface MonitoringChartProps {
  history: TelemetryPoint[];
  currentIngressRate: number;
  currentGwDepth: number;
  currentPondingCm: number;
  onAdvanceStep?: () => void;
}

export const MonitoringChart: React.FC<MonitoringChartProps> = ({
  history,
  currentIngressRate,
  currentGwDepth,
  currentPondingCm,
  onAdvanceStep,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'gw' | 'ingress'>('both');
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null);

  // Take last 10 points
  const points = history.slice(-10);

  // SVG dimensions
  const width = 580;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Scales
  // GW depth: -20m to 0m (Y: 0 at top, -20 at bottom or inverted)
  // Let's map -20m (bottom) to 0m (top)
  const minGw = -20;
  const maxGw = 0;
  const getYForGw = (val: number) => {
    // val is e.g. -12. 0 is top (paddingTop), -20 is bottom (paddingTop + chartH)
    const ratio = (val - minGw) / (maxGw - minGw); // ratio: 0 (bottom) to 1 (top)
    return paddingTop + chartH - ratio * chartH;
  };

  // Ingress: 0 to 250 L/min
  const minIngress = 0;
  const maxIngress = 250;
  const getYForIngress = (val: number) => {
    const ratio = Math.max(0, Math.min(1, (val - minIngress) / (maxIngress - minIngress)));
    return paddingTop + chartH - ratio * chartH;
  };

  // X coordinate
  const getX = (index: number, total: number) => {
    if (total <= 1) return paddingLeft + chartW / 2;
    return paddingLeft + (index / (total - 1)) * chartW;
  };

  // Generate SVG path for Groundwater Depth (Cyan)
  const gwPath = points.length > 0
    ? points.reduce((acc, pt, i) => {
        const x = getX(i, points.length);
        const y = getYForGw(pt.groundwaterDepthM);
        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, '')
    : '';

  // Generate SVG path for Ingress Flow Rate (Blue/Purple)
  const ingressPath = points.length > 0
    ? points.reduce((acc, pt, i) => {
        const x = getX(i, points.length);
        const y = getYForIngress(pt.inflowRateLpm);
        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, '')
    : '';

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
            Simulated Sensor Monitoring Telemetry
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Segmented Controls */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                activeTab === 'both' ? 'bg-cyan-900/60 text-cyan-200' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dual View
            </button>
            <button
              onClick={() => setActiveTab('gw')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                activeTab === 'gw' ? 'bg-cyan-900/60 text-cyan-200' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GW Head (m)
            </button>
            <button
              onClick={() => setActiveTab('ingress')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                activeTab === 'ingress' ? 'bg-cyan-900/60 text-cyan-200' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ingress (L/min)
            </button>
          </div>

          {onAdvanceStep && (
            <button
              onClick={onAdvanceStep}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
              title="Record instant simulated telemetry snapshot"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Log Step</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Simulated Data Watermark / Banner */}
      <div className="flex items-center justify-between px-2.5 py-1 rounded bg-slate-950/70 border border-slate-800/80 text-[10px] font-mono text-slate-400">
        <span className="text-cyan-400 font-semibold tracking-wide">
          ● SIMULATED SENSOR READINGS (LAST 10 TIME STEPS)
        </span>
        <span className="text-slate-500">SYNTHETIC GEOTECHNICAL DATA STREAM</span>
      </div>

      {/* SVG Chart Graphic */}
      <div className="relative w-full aspect-[21/9] min-h-[190px] bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden p-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + ratio * chartH;
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Left Axis: Groundwater (m) */}
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  fill="#00f2fe"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="end"
                  opacity="0.8"
                >
                  {Math.round(-20 + (1 - ratio) * 20)}m
                </text>
                {/* Right Axis: Ingress (L/min) */}
                <text
                  x={width - paddingRight + 6}
                  y={y + 3}
                  fill="#38bdf8"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="start"
                  opacity="0.8"
                >
                  {Math.round((1 - ratio) * 250)} L/m
                </text>
              </g>
            );
          })}

          {/* Vertical Time Step Lines */}
          {points.map((pt, idx) => {
            const x = getX(idx, points.length);
            return (
              <g key={pt.timeStep}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + chartH}
                  stroke="#1e293b"
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                />
                <text
                  x={x}
                  y={height - 8}
                  fill="#64748b"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  T-{points.length - idx}
                </text>
              </g>
            );
          })}

          {/* Ingress Flow Line (Blue) */}
          {(activeTab === 'both' || activeTab === 'ingress') && (
            <g>
              <path
                d={ingressPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((pt, idx) => {
                const x = getX(idx, points.length);
                const y = getYForIngress(pt.inflowRateLpm);
                return (
                  <circle
                    key={`ingress-${idx}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:r-5 transition-all"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </g>
          )}

          {/* Groundwater Head Line (Cyan) */}
          {(activeTab === 'both' || activeTab === 'gw') && (
            <g>
              <path
                d={gwPath}
                fill="none"
                stroke="#00f2fe"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((pt, idx) => {
                const x = getX(idx, points.length);
                const y = getYForGw(pt.groundwaterDepthM);
                return (
                  <circle
                    key={`gw-${idx}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#00f2fe"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:r-5 transition-all"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/40 rounded px-2.5 py-1 text-[11px] font-mono shadow-xl flex items-center gap-3 text-slate-200">
            <span className="text-cyan-300 font-bold">Step #{hoveredPoint.timeStep}</span>
            <span>GW: {hoveredPoint.groundwaterDepthM.toFixed(1)}m</span>
            <span>Inflow: {hoveredPoint.inflowRateLpm} L/min</span>
            <span>Ponding: {hoveredPoint.accumulatedWaterCm.toFixed(1)}cm</span>
            <span>Score: {hoveredPoint.riskScore}/100</span>
          </div>
        )}
      </div>

      {/* Telemetry Legend & Live Values */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-1 text-slate-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded bg-[#00f2fe]" />
            <span className="text-slate-400">GW Level:</span>
            <span className="text-[#00f2fe] font-bold tabular-nums">
              {currentGwDepth.toFixed(1)} m
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded bg-[#38bdf8]" />
            <span className="text-slate-400">Water Ingress:</span>
            <span className="text-[#38bdf8] font-bold tabular-nums">
              {currentIngressRate} L/min
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-500" />
            <span className="text-slate-400">Invert Ponding:</span>
            <span className="text-blue-300 font-bold tabular-nums">
              {currentPondingCm.toFixed(1)} cm
            </span>
          </div>
        </div>

        <span className="text-[10px] text-slate-400">
          Sample Frequency: Simulated 1-sec time step
        </span>
      </div>
    </div>
  );
};
