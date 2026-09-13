import React from 'react';
import { Shield, ShieldAlert, Cpu, Database, Zap, RefreshCw, GitBranch } from 'lucide-react';

export const Header = ({ health, onOpenPipeline, onRefreshHistory, onNavigateHome }) => {
  const isRedisOnline = health?.redis?.connected;
  const dbProvider = health?.database?.provider || 'In-Memory Store';

  return (
    <header className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 shadow-glow-cyan">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent font-mono">
                Phish<span className="text-cyan-400">Guard</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PRO-TI v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              URL Threat Intelligence & Autonomous Scoring Engine
            </p>
          </div>
        </div>

        {/* Telemetry Status Pills & Actions */}
        <div className="flex items-center flex-wrap gap-2.5 text-xs font-mono">
          {/* Redis Cache Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 text-slate-300">
            <Zap className={`w-3.5 h-3.5 ${isRedisOnline ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="text-slate-400">Cache:</span>
            <span className="text-cyan-300 font-semibold">{health?.redis?.provider || 'Redis Cache'}</span>
          </div>

          {/* Database Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 text-slate-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">DB:</span>
            <span className="text-emerald-300 font-semibold">{dbProvider.replace('(Mongoose)', '')}</span>
          </div>

          {/* Architecture Pipeline Button */}
          <button
            onClick={onOpenPipeline}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 transition-all hover:shadow-glow-cyan"
            title="Inspect backend scan pipeline architecture"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>Architecture Flow</span>
          </button>

          {/* Refresh History */}
          <button
            onClick={onRefreshHistory}
            className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-700 transition-colors"
            title="Refresh logs & statistics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Sleek Back to Terminal Button matching prompt requirement */}
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-gradient-to-r from-cyan-950 to-slate-900 hover:from-cyan-900 hover:to-slate-800 text-cyan-300 hover:text-white border border-cyan-500/50 hover:border-cyan-400 transition-all shadow-glow-cyan font-bold tracking-wide"
              title="Return to Cyber-Tech Home Page"
            >
              <span>← Back to Terminal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
