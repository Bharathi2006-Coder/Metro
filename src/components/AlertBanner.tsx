/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DynamicAlert } from '../types/simulation';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Flame,
  Droplet,
  ArrowRight,
  BellRing,
} from 'lucide-react';

interface AlertBannerProps {
  alerts: DynamicAlert[];
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  const getAlertStyles = (severity: DynamicAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          cardBg: 'bg-rose-950/70 border-rose-600/70 text-rose-100',
          badge: 'bg-rose-600 text-white',
          title: 'text-rose-200',
          iconColor: 'text-rose-400',
          actionBg: 'bg-rose-900/50 border-rose-700/60 text-rose-200',
        };
      case 'high':
        return {
          cardBg: 'bg-amber-950/70 border-amber-600/60 text-amber-100',
          badge: 'bg-amber-600 text-slate-950 font-bold',
          title: 'text-amber-200',
          iconColor: 'text-amber-400',
          actionBg: 'bg-amber-900/40 border-amber-700/50 text-amber-200',
        };
      case 'moderate':
        return {
          cardBg: 'bg-yellow-950/50 border-yellow-600/50 text-yellow-100',
          badge: 'bg-yellow-500 text-slate-950 font-bold',
          title: 'text-yellow-200',
          iconColor: 'text-yellow-400',
          actionBg: 'bg-yellow-900/40 border-yellow-700/50 text-yellow-200',
        };
      case 'low':
      default:
        return {
          cardBg: 'bg-emerald-950/40 border-emerald-600/40 text-emerald-100',
          badge: 'bg-emerald-600 text-white',
          title: 'text-emerald-200',
          iconColor: 'text-emerald-400',
          actionBg: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-200',
        };
    }
  };

  const renderIcon = (type: DynamicAlert['iconType'], className: string) => {
    switch (type) {
      case 'shield-check':
        return <ShieldCheck className={className} />;
      case 'alert-circle':
        return <AlertCircle className={className} />;
      case 'flame':
        return <Flame className={className} />;
      case 'droplet':
        return <Droplet className={className} />;
      case 'alert-triangle':
      default:
        return <AlertTriangle className={className} />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Real-Time Contextual Alerts ({alerts.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          AUTOMATED SAFETY INTERLOCK DISPATCH
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert) => {
          const styles = getAlertStyles(alert.severity);
          return (
            <div
              key={alert.id}
              className={`flex flex-col sm:flex-row items-start gap-3.5 p-3.5 rounded-xl border shadow-lg transition-all ${styles.cardBg}`}
            >
              {/* Icon */}
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 shrink-0">
                {renderIcon(alert.iconType, `w-5 h-5 ${styles.iconColor}`)}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded tracking-wider ${styles.badge}`}>
                    {alert.severity}
                  </span>
                  <h4 className={`text-xs font-bold tracking-tight ${styles.title}`}>
                    {alert.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {alert.explanation}
                </p>

                {/* Suggested immediate action box */}
                <div className={`mt-2 p-2 rounded border flex items-start gap-2 text-xs ${styles.actionBg}`}>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                  <div>
                    <span className="font-semibold text-white mr-1 text-[11px] uppercase tracking-wide">
                      Suggested Action:
                    </span>
                    <span className="text-[11px] leading-snug">{alert.suggestedAction}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
