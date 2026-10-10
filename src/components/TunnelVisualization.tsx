/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GroundwaterLevel,
  LeakageIntensity,
  DrainageStatus,
  SoilCondition,
} from '../types/simulation';
import { Eye, Info, Layers, Droplets, Activity, Gauge } from 'lucide-react';

interface TunnelVisualizationProps {
  groundwaterLevel: GroundwaterLevel;
  leakageIntensity: LeakageIntensity;
  drainageStatus: DrainageStatus;
  soilCondition: SoilCondition;
  isPumpRunning: boolean;
  waterAccumulationCm: number;
  onInspectElement?: (elementName: string) => void;
}

export const TunnelVisualization: React.FC<TunnelVisualizationProps> = ({
  groundwaterLevel,
  leakageIntensity,
  drainageStatus,
  soilCondition,
  isPumpRunning,
  waterAccumulationCm,
  onInspectElement,
}) => {
  const [showLabels, setShowLabels] = useState(true);
  const [showGeology, setShowGeology] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Groundwater level coordinates in SVG (Y coordinate: 0 at ground surface Y=80, tunnel crown Y=220, springline Y=320, invert Y=420)
  // Low: -18m -> SVG Y = 450 (below invert)
  // Normal: -12m -> SVG Y = 320 (tunnel springline)
  // High: -6m -> SVG Y = 170 (above tunnel crown)
  // Critical: -2m -> SVG Y = 110 (near surface, heavy surcharge)
  const gwYMap: Record<GroundwaterLevel, number> = {
    low: 450,
    normal: 320,
    high: 170,
    critical: 110,
  };
  const waterTableY = gwYMap[groundwaterLevel];

  // Water Ingress flow rates and visual parameters
  const leakageRateMap: Record<LeakageIntensity, { lpm: number; drops: number; speedClass: string }> = {
    none: { lpm: 0, drops: 0, speedClass: '' },
    low: { lpm: 8, drops: 2, speedClass: 'anim-water-drip' },
    moderate: { lpm: 35, drops: 4, speedClass: 'anim-water-drip' },
    high: { lpm: 90, drops: 6, speedClass: 'anim-water-drip-fast' },
    severe: { lpm: 220, drops: 8, speedClass: 'anim-water-drip-fast' },
  };
  const currentLeak = leakageRateMap[leakageIntensity];

  // Sump water height calculation (0 to 36 px in sump pit)
  const sumpWaterHeight = Math.min(36, Math.max(4, Math.round((waterAccumulationCm / 60) * 36)));

  // Invert pooling water height (0 to 18 px on tunnel floor)
  const invertPoolHeight = Math.min(18, Math.max(0, Math.round((waterAccumulationCm / 60) * 18)));

  const handleElementClick = (title: string, desc: string) => {
    setActiveTooltip(`${title}: ${desc}`);
    if (onInspectElement) onInspectElement(title);
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Top Status & Overlay Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-semibold text-slate-100 tracking-wide">
            CROSS-SECTION ELEVATION: SECTION T-01
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono">Chainage 14+320.00</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Engineering Labels */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors text-xs font-medium border ${
              showLabels
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle CAD engineering labels"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Labels: {showLabels ? 'ON' : 'OFF'}</span>
          </button>

          {/* Toggle Geology Strata */}
          <button
            onClick={() => setShowGeology(!showGeology)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors text-xs font-medium border ${
              showGeology
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle geotechnical soil layer stratigraphy"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Geology: {showGeology ? 'ON' : 'OFF'}</span>
          </button>

          {/* Live Ingress badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 rounded font-mono text-xs">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Inflow:</span>
            <span className="font-semibold text-cyan-300 tabular-nums">
              {currentLeak.lpm} L/min
            </span>
          </div>

          {/* Sump Ponding Depth */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 rounded font-mono text-xs">
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Ponding:</span>
            <span className="font-semibold text-blue-300 tabular-nums">
              {waterAccumulationCm.toFixed(1)} cm
            </span>
          </div>
        </div>
      </div>

      {/* SVG Container with responsive aspect ratio */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] max-h-[560px] bg-[#070b14] overflow-hidden select-none">
        <svg
          viewBox="0 0 960 540"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Ground Surface Hatching */}
            <pattern
              id="hatch-fill"
              width="10"
              height="10"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="10" stroke="#334155" strokeWidth="1" strokeOpacity="0.5" />
            </pattern>

            <pattern
              id="sand-dots"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="0.8" fill="#e2b170" fillOpacity="0.25" />
              <circle cx="8" cy="8" r="0.8" fill="#e2b170" fillOpacity="0.25" />
            </pattern>

            {/* Linear Gradients */}
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="100%" stopColor="#091328" />
            </linearGradient>

            <linearGradient id="madeGroundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#252422" />
              <stop offset="100%" stopColor="#1e1e1e" />
            </linearGradient>

            <linearGradient id="clayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a2e39" />
              <stop offset="100%" stopColor="#1f242d" />
            </linearGradient>

            <linearGradient id="aquiferGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19283a" />
              <stop offset="100%" stopColor="#132030" />
            </linearGradient>

            <linearGradient id="bedrockGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#141824" />
              <stop offset="100%" stopColor="#0d111a" />
            </linearGradient>

            {/* Groundwater Shading */}
            <linearGradient id="groundwaterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.55" />
            </linearGradient>

            {/* Segmental Concrete Lining */}
            <radialGradient id="tunnelInteriorGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0a1220" />
              <stop offset="85%" stopColor="#050a12" />
              <stop offset="100%" stopColor="#020508" />
            </radialGradient>

            <linearGradient id="concreteRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Filter for water drop glow */}
            <filter id="waterGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ============================================================ */}
          {/* 1. SKY & URBAN GROUND SURFACE (Y: 0 to 75) */}
          {/* ============================================================ */}
          <rect x="0" y="0" width="960" height="75" fill="url(#skyGrad)" />

          {/* Urban skyline silhouettes */}
          {/* Building 1 (Left) */}
          <rect x="60" y="25" width="70" height="50" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          <line x1="75" y1="35" x2="85" y2="35" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="105" y1="35" x2="115" y2="35" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="75" y1="50" x2="85" y2="50" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="105" y1="50" x2="115" y2="50" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />

          {/* Building 2 (Mid-Left) */}
          <rect x="150" y="10" width="90" height="65" fill="#0b1329" stroke="#1e293b" strokeWidth="1" />
          <rect x="180" y="2" width="4" height="8" fill="#64748b" />

          {/* Street light / Utilities */}
          <line x1="260" y1="45" x2="260" y2="75" stroke="#475569" strokeWidth="2" />
          <line x1="260" y1="45" x2="272" y2="45" stroke="#475569" strokeWidth="2" />
          <circle cx="272" cy="46" r="2.5" fill="#fef08a" />

          {/* Monitoring Prism MP-01 on street surface */}
          <g
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleElementClick('Prism MP-01', 'Automated Optical Total Station Prism for detecting surface settlement & subsidence.')}
          >
            <polygon points="350,70 355,75 345,75" fill="#38bdf8" />
            <circle cx="350" cy="69" r="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <text x="350" y="60" fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">MP-01</text>
          </g>

          {/* Road Surface Line (Y = 75) */}
          <line x1="0" y1="75" x2="960" y2="75" stroke="#475569" strokeWidth="3" />
          {/* Road dash marks */}
          <line x1="0" y1="73" x2="960" y2="73" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="16 20" strokeOpacity="0.3" />

          {/* Monitoring Prism MP-02 on right */}
          <g
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleElementClick('Prism MP-02', 'Surface monitoring benchmark assessing differential building heave/settlement.')}
          >
            <polygon points="610,70 615,75 605,75" fill="#38bdf8" />
            <circle cx="610" cy="69" r="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <text x="610" y="60" fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">MP-02</text>
          </g>

          {/* Urban Building 3 (Right) */}
          <rect x="730" y="18" width="110" height="57" fill="#0d1527" stroke="#1e293b" strokeWidth="1" />
          <rect x="860" y="32" width="70" height="43" fill="#0a101d" stroke="#1e293b" strokeWidth="1" />

          {/* ============================================================ */}
          {/* 2. GEOTECHNICAL SOIL STRATIGRAPHY LAYERS (Y: 75 to 540) */}
          {/* ============================================================ */}
          {showGeology ? (
            <g id="geological-layers">
              {/* Layer 1: Anthropogenic Made Ground / Urban Fill (75m to 140m / Depth 0 to 4.5m) */}
              <rect x="0" y="75" width="960" height="65" fill="url(#madeGroundGrad)" />
              <rect x="0" y="75" width="960" height="65" fill="url(#hatch-fill)" />
              <line x1="0" y1="140" x2="960" y2="140" stroke="#334155" strokeWidth="1" strokeDasharray="6 4" />

              {/* Layer 2: Silty Clay Aquitard (140 to 220 / Depth 4.5 to 10.0m) */}
              <rect x="0" y="140" width="960" height="80" fill="url(#clayGrad)" />
              <line x1="0" y1="220" x2="960" y2="220" stroke="#334155" strokeWidth="1" strokeDasharray="6 4" />

              {/* Layer 3: Sand & Silt Aquifer (220 to 440 / Depth 10.0 to 24.5m - Tunnel Enclosure) */}
              <rect x="0" y="220" width="960" height="220" fill="url(#aquiferGrad)" />
              <rect x="0" y="220" width="960" height="220" fill="url(#sand-dots)" />
              <line x1="0" y1="440" x2="960" y2="440" stroke="#334155" strokeWidth="1" strokeDasharray="6 4" />

              {/* Layer 4: Weathered Bedrock / Siltstone (440 to 540 / Depth 24.5m+) */}
              <rect x="0" y="440" width="960" height="100" fill="url(#bedrockGrad)" />
            </g>
          ) : (
            <rect x="0" y="75" width="960" height="465" fill="#0f172a" />
          )}

          {/* Geological Stratigraphy Text Annotations */}
          {showGeology && showLabels && (
            <g id="geology-tags" opacity="0.8" className="select-none">
              <text x="20" y="110" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                STRATUM 1: Urban Fill & Made Ground (0.0 to -4.5m)
              </text>
              <text x="20" y="180" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                STRATUM 2: Silty Clay Aquitard (-4.5 to -10.0m)
              </text>
              <text x="20" y="260" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                STRATUM 3: Water-Bearing Sand Aquifer (-10.0 to -24.5m)
              </text>
              <text x="20" y="480" fill="#64748b" fontSize="10" fontFamily="monospace">
                STRATUM 4: Weathered Bedrock / Basal Siltstone (-24.5m+)
              </text>
            </g>
          )}

          {/* Soil Condition Graphic Indicators (Loss of Fines / Piping effect) */}
          {soilCondition === 'possible_erosion' && (
            <g id="soil-piping-hazard" opacity="0.85">
              {/* Erosion void cavity near tunnel crown/springline */}
              <path
                d="M 400 220 Q 370 190 350 215 Q 330 240 370 250 Z"
                fill="#451a03"
                stroke="#b45309"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="350" y="200" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
                ⚠ Sub-surface Void (Piping)
              </text>
              {/* Silt particles moving toward lining */}
              <circle cx="365" cy="225" r="2" fill="#d97706" className="anim-water-drip" />
              <circle cx="380" cy="235" r="1.5" fill="#d97706" className="anim-water-drip-delayed" />
            </g>
          )}

          {/* ============================================================ */}
          {/* 3. GROUNDWATER TABLE & HYDROSTATIC SATURATION */}
          {/* ============================================================ */}
          {/* Groundwater Fill Polygon (Below waterTableY down to bottom 540) */}
          <g id="groundwater-zone">
            <rect
              x="0"
              y={waterTableY}
              width="960"
              height={540 - waterTableY}
              fill="url(#groundwaterGrad)"
              className="transition-all duration-700 ease-out"
            />

            {/* Phreatic Surface Wave Line */}
            <path
              d={`M 0 ${waterTableY} Q 240 ${waterTableY - 3} 480 ${waterTableY} T 960 ${waterTableY}`}
              fill="none"
              stroke="#00f2fe"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              className="anim-wave transition-all duration-700 ease-out"
            />

            {/* Inverted Triangle Water Table Symbols */}
            <polygon
              points={`140,${waterTableY} 150,${waterTableY - 14} 130,${waterTableY - 14}`}
              fill="none"
              stroke="#00f2fe"
              strokeWidth="1.5"
            />
            <line x1="126" y1={waterTableY - 14} x2="154" y2={waterTableY - 14} stroke="#00f2fe" strokeWidth="1.5" />
            <line x1="131" y1={waterTableY - 18} x2="149" y2={waterTableY - 18} stroke="#00f2fe" strokeWidth="1.5" />

            {/* Groundwater Elevation Marker Text */}
            <g
              className="cursor-pointer"
              onClick={() => handleElementClick('Groundwater Table', `Piezometric head currently simulated at ${groundwaterLevel.toUpperCase()} depth (${waterTableY < 200 ? 'Surcharge above crown' : 'Near/below springline'}).`)}
            >
              <rect
                x="160"
                y={waterTableY - 18}
                width="170"
                height="22"
                fill="#030712"
                stroke="#06b6d4"
                strokeWidth="1"
                rx="3"
              />
              <text
                x="166"
                y={waterTableY - 4}
                fill="#22d3ee"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                GW TABLE: {groundwaterLevel.toUpperCase()} ({waterTableY < 180 ? '-6m to -2m' : waterTableY < 350 ? '-12.0m' : '-18.0m'})
              </text>
            </g>
          </g>

          {/* BOREHOLE PIEZOMETER PZ-01 (Left of tunnel) */}
          <g
            className="cursor-pointer hover:opacity-90"
            onClick={() => handleElementClick('Piezometer PZ-01', 'Vibrating wire piezometer measuring hydrostatic pore water pressure at depth.')}
          >
            {/* Protective head cover on surface */}
            <rect x="232" y="68" width="16" height="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            {/* Standpipe casing */}
            <line x1="240" y1="75" x2="240" y2="460" stroke="#0284c7" strokeWidth="3" />
            {/* Slotted filter tip in aquifer */}
            <rect x="237" y="380" width="6" height="60" fill="#38bdf8" stroke="#0369a1" strokeWidth="1" strokeDasharray="2 2" />
            {/* Water column inside pipe */}
            <line x1="240" y1={waterTableY} x2="240" y2="440" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
            {showLabels && (
              <text x="225" y="100" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="end">
                Piezometer PZ-01 ➔
              </text>
            )}
          </g>

          {/* ============================================================ */}
          {/* 4. UNDERGROUND METRO TUNNEL CROSS-SECTION */}
          {/* Center: (480, 320), Outer Radius: 130px, Inner Radius: 112px */}
          {/* Crown: (480, 208), Invert: (480, 432), Diameter: 6.5m */}
          {/* ============================================================ */}

          {/* Segmental Precast Concrete Lining Ring (Outer shell) */}
          <circle
            cx="480"
            cy="320"
            r="130"
            fill="url(#concreteRingGrad)"
            stroke="#1e293b"
            strokeWidth="2"
            className="cursor-pointer"
            onClick={() => handleElementClick('Segmental Lining', 'Precast reinforced concrete segmental ring (C50/60). Internal diameter 6.0m, outer diameter 6.5m.')}
          />

          {/* Segmental Ring Radial Joints (Simulating 6-segment + 1 key ring) */}
          {/* Joint 1: 0 deg (Crown Key Segment) */}
          <line x1="480" y1="190" x2="480" y2="208" stroke="#0f172a" strokeWidth="2.5" />
          {/* Joint 2: 60 deg */}
          <line x1="592" y1="255" x2="577" y2="264" stroke="#0f172a" strokeWidth="2.5" />
          {/* Joint 3: 120 deg */}
          <line x1="592" y1="385" x2="577" y2="376" stroke="#0f172a" strokeWidth="2.5" />
          {/* Joint 4: 180 deg (Invert Joint) */}
          <line x1="480" y1="432" x2="480" y2="450" stroke="#0f172a" strokeWidth="2.5" />
          {/* Joint 5: 240 deg */}
          <line x1="368" y1="385" x2="383" y2="376" stroke="#0f172a" strokeWidth="2.5" />
          {/* Joint 6: 300 deg (Defective Gasket Seepage Joint J-04) */}
          <line x1="368" y1="255" x2="383" y2="264" stroke="#ef4444" strokeWidth="3" />

          {/* Inner Excavated Tunnel Void (Radius: 112px) */}
          <circle
            cx="480"
            cy="320"
            r="112"
            fill="url(#tunnelInteriorGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Tunnel Crown Segment Key Marker */}
          <rect x="475" y="208" width="10" height="5" fill="#94a3b8" />

          {/* Tunnel Track Bed / Invert Concrete Slab (Flat bottom fill at Y: 395 to 432) */}
          <path
            d="M 400 400 L 560 400 L 550 430 L 410 430 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Metro Rail Track Rails (Twin standard gauge 1435mm) */}
          {/* Left Rail */}
          <rect x="440" y="392" width="5" height="8" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.5" />
          {/* Right Rail */}
          <rect x="515" y="392" width="5" height="8" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.5" />
          {/* Sleepers / Track Plinths */}
          <rect x="430" y="398" width="100" height="4" fill="#475569" />

          {/* Metro Kinematic Envelope Profile (Dashed train silhouette) */}
          <rect
            x="440"
            y="265"
            width="80"
            height="125"
            rx="12"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1"
            strokeDasharray="4 3"
            opacity="0.3"
          />
          <text x="480" y="315" fill="#0ea5e9" fontSize="8" textAnchor="middle" opacity="0.4" fontFamily="monospace">
            METRO ENVELOPE
          </text>

          {/* Walkway / Refuge Niche on left */}
          <rect x="375" y="380" width="22" height="22" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <line x1="375" y1="380" x2="397" y2="380" stroke="#f59e0b" strokeWidth="1.5" />

          {/* ============================================================ */}
          {/* 5. INVERT DRAINAGE TRENCH, SUMP PIT & PUMP */}
          {/* ============================================================ */}
          {/* Invert Longitudinal Drainage Trench (Trench at right side of track slab: X: 540 to 555, Y: 400 to 415) */}
          <rect
            x="540"
            y="400"
            width="16"
            height="15"
            fill="#090d16"
            stroke="#0ea5e9"
            strokeWidth="1"
            className="cursor-pointer"
            onClick={() => handleElementClick('Drainage Trench', 'Invert side ditch collecting surface seepage and conveying water gravity-wise to the sump pit.')}
          />

          {/* Collection Sump Pit SP-01 (X: 560 to 590, Y: 400 to 442) */}
          <g
            className="cursor-pointer"
            onClick={() => handleElementClick('Sump Pit SP-01', 'Invert drainage sump pit collecting runoff from tunnel chainage.')}
          >
            <rect
              x="560"
              y="405"
              width="30"
              height="38"
              fill="#090d16"
              stroke={drainageStatus === 'blocked' ? '#ef4444' : '#0284c7'}
              strokeWidth="1.5"
            />
            {/* Trash Screen / Sump Grate */}
            <line x1="560" y1="405" x2="590" y2="405" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />

            {/* Sump Pit Water Accumulation Fill */}
            <rect
              x="562"
              y={443 - sumpWaterHeight}
              width="26"
              height={sumpWaterHeight}
              fill="#0284c7"
              opacity="0.8"
              className="transition-all duration-300"
            />

            {/* Drainage status indicator icon in sump */}
            {drainageStatus === 'blocked' && (
              <text x="575" y="425" fill="#f87171" fontSize="10" textAnchor="middle" fontWeight="bold">
                ✕ BLK
              </text>
            )}
            {drainageStatus === 'partial_blocked' && (
              <text x="575" y="425" fill="#facc15" fontSize="8" textAnchor="middle">
                ⚠ ~50%
              </text>
            )}
          </g>

          {/* Submersible Dewatering Pump P-101 */}
          <g
            className={`cursor-pointer ${isPumpRunning && drainageStatus !== 'pump_failure' ? 'anim-pump-glow' : ''}`}
            onClick={() => handleElementClick('Dewatering Pump P-101', `Submersible dewatering pump with mechanical float switch. Status: ${isPumpRunning ? 'RUNNING' : 'IDLE'}.`)}
          >
            {/* Pump body sitting in sump */}
            <rect
              x="568"
              y="415"
              width="14"
              height="20"
              fill={drainageStatus === 'pump_failure' ? '#7f1d1d' : isPumpRunning ? '#06b6d4' : '#1e293b'}
              stroke={drainageStatus === 'pump_failure' ? '#ef4444' : isPumpRunning ? '#22d3ee' : '#475569'}
              strokeWidth="1.5"
              rx="2"
            />
            {/* Suction strainer at pump base */}
            <line x1="570" y1="433" x2="580" y2="433" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="1 1" />

            {/* Discharge Rising Main (Pipe going up & out of tunnel) */}
            <path
              d="M 575 415 L 575 360 L 595 340 L 610 320"
              fill="none"
              stroke={isPumpRunning && drainageStatus !== 'pump_failure' && drainageStatus !== 'blocked' ? '#22d3ee' : '#475569'}
              strokeWidth="3"
              className={isPumpRunning && drainageStatus !== 'pump_failure' && drainageStatus !== 'blocked' ? 'anim-flow' : ''}
            />

            {/* Pump Running Status Glow / Water discharge spray */}
            {isPumpRunning && drainageStatus !== 'pump_failure' && drainageStatus !== 'blocked' && (
              <g>
                <circle cx="610" cy="320" r="4" fill="#38bdf8" filter="url(#waterGlow)" />
                <path d="M 610 320 Q 625 315 635 325" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" className="anim-flow" />
              </g>
            )}
          </g>

          {/* Invert Track Slab Water Pooling (Flooding indicator) */}
          {invertPoolHeight > 0 && (
            <path
              d={`M 410 400 L 550 400 L 545 ${400 - invertPoolHeight} L 415 ${400 - invertPoolHeight} Z`}
              fill="#0284c7"
              opacity="0.65"
              className="transition-all duration-300"
            />
          )}

          {/* Animated Water flow line into drainage trench when water exists */}
          {waterAccumulationCm > 2 && (
            <path
              d="M 450 398 L 540 403"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="anim-flow"
            />
          )}

          {/* ============================================================ */}
          {/* 6. WATER SEEPAGE AT DEFECTIVE GASKET JOINT J-04 (Left Springline/Crown) */}
          {/* Joint origin: (383, 264) */}
          {/* ============================================================ */}
          {leakageIntensity !== 'none' && (
            <g id="water-seepage-source">
              {/* Defective joint beacon highlight */}
              <circle
                cx="383"
                cy="264"
                r="5"
                fill="#ef4444"
                opacity="0.7"
                className="cursor-pointer"
                onClick={() => handleElementClick('Joint J-04', 'Defective EPDM elastomeric gasket joint experiencing hydrostatic pore water ingress.')}
              />
              <circle cx="383" cy="264" r="9" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />

              {/* Water droplet drips animated falling down to invert (Y: 264 to 395) */}
              {/* Drop 1 */}
              <circle
                cx="386"
                cy="270"
                r="3"
                fill="#38bdf8"
                filter="url(#waterGlow)"
                className={currentLeak.speedClass}
              />

              {/* Drop 2 (Staggered) */}
              {currentLeak.drops >= 4 && (
                <circle
                  cx="389"
                  cy="270"
                  r="2.5"
                  fill="#38bdf8"
                  filter="url(#waterGlow)"
                  className={`${currentLeak.speedClass}-delayed`}
                />
              )}

              {/* High / Severe Inflow Jets */}
              {(leakageIntensity === 'high' || leakageIntensity === 'severe') && (
                <g>
                  {/* Additional seepage streams */}
                  <line
                    x1="383"
                    y1="264"
                    x2="400"
                    y2="390"
                    stroke="#38bdf8"
                    strokeWidth={leakageIntensity === 'severe' ? '3' : '1.8'}
                    strokeDasharray="8 4"
                    className="anim-flow"
                    opacity="0.8"
                  />
                  {/* Seepage splash on track slab */}
                  <ellipse cx="400" cy="396" rx="8" ry="2.5" fill="#38bdf8" opacity="0.75" />
                </g>
              )}

              {/* Crown Minor Weep Seepage (When Critical GW) */}
              {groundwaterLevel === 'critical' && (
                <g>
                  <circle cx="480" cy="208" r="3" fill="#f87171" />
                  <circle cx="480" cy="214" r="2.5" fill="#38bdf8" className="anim-water-drip" />
                </g>
              )}
            </g>
          )}

          {/* ============================================================ */}
          {/* 7. ENGINEERING CAD CALLOUT LABELS & DIMENSIONS */}
          {/* ============================================================ */}
          {showLabels && (
            <g id="engineering-labels" className="select-none pointer-events-none">
              {/* Ground Surface Callout */}
              <line x1="680" y1="75" x2="710" y2="55" stroke="#94a3b8" strokeWidth="1" />
              <line x1="710" y1="55" x2="770" y2="55" stroke="#94a3b8" strokeWidth="1" />
              <text x="775" y="58" fill="#e2e8f0" fontSize="9" fontFamily="monospace">
                GROUND SURFACE (El. +28.5m)
              </text>

              {/* Tunnel Lining Crown */}
              <line x1="480" y1="190" x2="520" y2="150" stroke="#94a3b8" strokeWidth="1" />
              <line x1="520" y1="150" x2="590" y2="150" stroke="#94a3b8" strokeWidth="1" />
              <text x="595" y="153" fill="#e2e8f0" fontSize="9" fontFamily="monospace">
                CROWN LINING (Ø 6.5m Ext)
              </text>

              {/* Seepage Joint J-04 Label */}
              <line x1="380" y1="264" x2="310" y2="280" stroke="#ef4444" strokeWidth="1" />
              <line x1="310" y1="280" x2="250" y2="280" stroke="#ef4444" strokeWidth="1" />
              <text x="245" y="283" fill="#fca5a5" fontSize="9" fontFamily="monospace" textAnchor="end">
                SEEPAGE JOINT J-04 [{leakageIntensity.toUpperCase()}]
              </text>

              {/* Invert Sump Pit Callout */}
              <line x1="590" y1="420" x2="630" y2="440" stroke="#0ea5e9" strokeWidth="1" />
              <line x1="630" y1="440" x2="700" y2="440" stroke="#0ea5e9" strokeWidth="1" />
              <text x="705" y="443" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                SUMP SP-01 & PUMP P-101
              </text>

              {/* Invert Track Slab */}
              <line x1="430" y1="425" x2="380" y2="465" stroke="#94a3b8" strokeWidth="1" />
              <line x1="380" y1="465" x2="320" y2="465" stroke="#94a3b8" strokeWidth="1" />
              <text x="315" y="468" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="end">
                INVERT SLAB (Track Level)
              </text>

              {/* Scale / Dimension Indicator */}
              <g transform="translate(860, 480)">
                <line x1="0" y1="0" x2="70" y2="0" stroke="#64748b" strokeWidth="1.5" />
                <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748b" strokeWidth="1.5" />
                <line x1="70" y1="-4" x2="70" y2="4" stroke="#64748b" strokeWidth="1.5" />
                <text x="35" y="-6" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  5.0 METERS
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Dynamic Tooltip Bar at bottom of graphic */}
        {activeTooltip && (
          <div className="absolute bottom-2 left-3 right-3 bg-slate-950/90 backdrop-blur border border-cyan-500/40 rounded px-3 py-1.5 flex items-center justify-between text-xs text-slate-200 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-mono text-cyan-200">{activeTooltip}</span>
            </div>
            <button
              onClick={() => setActiveTooltip(null)}
              className="text-slate-400 hover:text-white px-1.5 py-0.5 text-[11px] rounded bg-slate-800"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Cross-section Legend & Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950/90 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400/80 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 block text-[10px]">HYDROSTATIC LEVEL</span>
            <span className="text-slate-200 font-mono font-medium capitalize">{groundwaterLevel} Head</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              leakageIntensity === 'none'
                ? 'bg-slate-600'
                : leakageIntensity === 'low'
                ? 'bg-blue-400'
                : leakageIntensity === 'moderate'
                ? 'bg-yellow-400'
                : 'bg-rose-500 animate-pulse'
            }`}
          />
          <div className="truncate">
            <span className="text-slate-400 block text-[10px]">JOINT J-04 SEEPAGE</span>
            <span className="text-slate-200 font-mono font-medium capitalize">{leakageIntensity} ({currentLeak.lpm} L/min)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              drainageStatus === 'normal'
                ? 'bg-emerald-500'
                : drainageStatus === 'partial_blocked'
                ? 'bg-yellow-400'
                : 'bg-rose-500'
            }`}
          />
          <div className="truncate">
            <span className="text-slate-400 block text-[10px]">DRAINAGE & SUMP</span>
            <span className="text-slate-200 font-mono font-medium capitalize">
              {drainageStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              isPumpRunning
                ? drainageStatus === 'pump_failure' || drainageStatus === 'blocked'
                  ? 'bg-amber-500'
                  : 'bg-cyan-400 animate-ping'
                : 'bg-slate-600'
            }`}
          />
          <div className="truncate">
            <span className="text-slate-400 block text-[10px]">PUMP P-101 STATUS</span>
            <span
              className={`font-mono font-medium ${
                isPumpRunning
                  ? drainageStatus === 'pump_failure'
                    ? 'text-rose-400'
                    : 'text-cyan-300'
                  : 'text-slate-400'
              }`}
            >
              {isPumpRunning
                ? drainageStatus === 'pump_failure'
                  ? 'TRIPPED / FAULT'
                  : 'RUNNING (DRAINING)'
                : 'STANDBY (IDLE)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
