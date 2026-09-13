import React from 'react';
import { AlertOctagon, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

export const RiskCard = ({ indicators, riskCategory }) => {
  const isClean = !indicators || indicators.length === 0 || riskCategory === 'SAFE';

  return (
    <div className="relative rounded-xl bg-slate-900/70 border border-red-500/30 backdrop-blur-xl p-5 shadow-lg shadow-black/40 overflow-hidden flex flex-col justify-between group hover:border-red-400/50 transition-all">
      {/* Decorative cyber corner accents in red/amber */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>

      <div>
        {/* Card Header matching reference image: RISK TRIGGERS: */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-extrabold tracking-widest uppercase font-mono text-red-400">
              RISK TRIGGERS:
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-300">
            {indicators?.length || 0} Detections
          </span>
        </div>

        {/* Triggered Items List */}
        {isClean ? (
          <div className="py-6 flex flex-col items-center justify-center text-center font-mono">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
            <div className="text-emerald-300 font-bold text-sm">NO RISK HEURISTICS TRIGGERED</div>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              Domain passed all automated structural, cryptographic, and heuristic threat checks.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 font-mono">
            {indicators.map((item, idx) => {
              const isCritical = item.severity === 'CRITICAL';
              const isHigh = item.severity === 'HIGH';

              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-red-500/40 transition-colors"
                >
                  {/* Cyber chevron bullet » matching reference image */}
                  <span className="text-red-500 font-bold text-base leading-none select-none mt-0.5">
                    »
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-red-200 truncate">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded shrink-0 font-bold ${
                          isCritical
                            ? 'bg-red-900/80 text-red-200 border border-red-500'
                            : isHigh
                            ? 'bg-amber-900/80 text-amber-200 border border-amber-500'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isClean ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'}`}></span>
          Threat Level: <strong className={isClean ? 'text-emerald-400' : 'text-red-400'}>{riskCategory}</strong>
        </span>
        <span className="text-[11px] text-slate-500">Automated Heuristic Engine</span>
      </div>
    </div>
  );
};
