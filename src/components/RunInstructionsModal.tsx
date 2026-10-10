/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Terminal, Copy, Check, Chrome, PlayCircle, FolderCode } from 'lucide-react';

interface RunInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunInstructionsModal: React.FC<RunInstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                How to Run the Application
              </h2>
              <span className="text-xs text-cyan-300 font-mono">
                Instructions for Google AI Studio & Local Chrome Environments
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

        {/* Section 1: Running in Google AI Studio */}
        <div className="space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs sm:text-sm">
            <PlayCircle className="w-4 h-4" />
            <span>Option A: Running within Google AI Studio (Instant Preview)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The application is pre-configured and already running live in your preview pane! Vite starts the development server automatically on port 3000.
          </p>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            <li>Preview URL is rendered directly in the embedded interactive frame.</li>
            <li>No external API keys, database credentials, or paid cloud services are required.</li>
            <li>All simulation computations, graphics, and telemetry charting execute locally in the client browser.</li>
          </ul>
        </div>

        {/* Section 2: Running Locally on your Laptop / Chrome */}
        <div className="space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs sm:text-sm">
            <Chrome className="w-4 h-4" />
            <span>Option B: Running Locally on Laptop (Terminal & Chrome)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To run this project on any computer with Node.js installed:
          </p>

          {/* Step 1: Clone / Navigate */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-200">1. Clone or download project files and open terminal:</span>
            <div className="relative bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
              <code>git clone &lt;repo-url&gt; &amp;&amp; cd metro-groundwater-simulation</code>
              <button
                onClick={() => copyToClipboard('git clone <repo-url> && cd metro-groundwater-simulation', 'step1')}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
              >
                {copied === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Step 2: Install dependencies */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-200">2. Install dependencies:</span>
            <div className="relative bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
              <code>npm install</code>
              <button
                onClick={() => copyToClipboard('npm install', 'step2')}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
              >
                {copied === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Step 3: Start dev server */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-200">3. Start the local Vite server:</span>
            <div className="relative bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
              <code>npm run dev</code>
              <button
                onClick={() => copyToClipboard('npm run dev', 'step3')}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
              >
                {copied === 'step3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Step 4: Open in Chrome */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-200">4. Open Google Chrome:</span>
            <div className="relative bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
              <code>http://localhost:3000</code>
              <button
                onClick={() => copyToClipboard('http://localhost:3000', 'step4')}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
              >
                {copied === 'step4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Architecture for Civil Engineering Students */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
            <FolderCode className="w-4 h-4 text-cyan-400" />
            <span>Code Structure for Civil Engineering Students & Modifications:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All rule-based geotechnical algorithms are located in <code className="text-cyan-300 font-mono">src/utils/riskEngine.ts</code>.
            Students can freely modify the point weights, add new soil types (e.g. quicksand, karstic limestone cavities), or tweak piezometer threshold depths to model specific tunnel projects.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
