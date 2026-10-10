/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  RotateCcw,
  BookOpen,
  HelpCircle,
  FileCode,
  Volume2,
  VolumeX,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenHowItWorks: () => void;
  onOpenAlgorithm: () => void;
  onOpenInstructions: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenHowItWorks,
  onOpenAlgorithm,
  onOpenInstructions,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Brand & Project Identity */}
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                Civil Engineering Hackathon 2026
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">
                Module: Groundwater Risk Mitigation
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-cyan-400">Smart & Safe</span> Urban Metro Underground Excavation
            </h1>

            <p className="text-xs text-slate-400">
              Interactive Groundwater Monitoring and Risk Control System
            </p>
          </div>

          {/* Operational Status Badges & Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 lg:pt-0">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/70 border border-cyan-500/40 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-bold">SIMULATION MODE</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">Site: Tunnel Section T-01</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              {/* How It Works Button */}
              <button
                type="button"
                onClick={onOpenHowItWorks}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-md border border-slate-700 transition-colors"
                title="View Hackathon objectives, workflow & features"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">How It Works</span>
              </button>

              {/* Algorithm Details Button */}
              <button
                type="button"
                onClick={onOpenAlgorithm}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-md border border-slate-700 transition-colors"
                title="Technical formula & weighting explanation"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Algorithm</span>
              </button>

              {/* Run Instructions Button */}
              <button
                type="button"
                onClick={onOpenInstructions}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-md border border-slate-700 transition-colors"
                title="Instructions for running locally in Chrome"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Run Guide</span>
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={onToggleSound}
                className={`p-1.5 rounded-md border transition-colors ${
                  soundEnabled
                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title={soundEnabled ? 'Mute audio alerts' : 'Enable synthetic audio alerts'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Reset Demo Button */}
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-md border border-cyan-400 transition-colors shadow-sm"
                title="Reset simulation parameters to default baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
