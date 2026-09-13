import React from 'react';
import { X, ArrowDown, Database, Cpu, ShieldCheck, Zap, Server, Globe, Lock, Activity } from 'lucide-react';

export const PipelineModal = ({ isOpen, onClose, activeStage = 'IDLE', isCached = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-950/95 border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/50 font-mono text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wider">
                PHISHGUARD SYSTEM ARCHITECTURE PIPELINE
              </h2>
              <p className="text-xs text-slate-400">
                End-to-End URL Processing & Algorithmic Heuristic Scoring Pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Diagram faithfully recreating the reference image diagram */}
        <div className="flex flex-col items-center gap-3 py-2 max-w-xl mx-auto">
          {/* Node 1: User Request */}
          <div className="w-72 p-3 rounded-lg bg-slate-900 border border-slate-700 text-center shadow-md">
            <div className="text-[10px] text-slate-400 uppercase">Input Trigger</div>
            <div className="text-sm font-bold text-slate-100">USER REQUEST: /api/scan</div>
          </div>

          <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />

          {/* Node 2: Rate Limiter */}
          <div className="w-72 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-center shadow-md relative">
            <span className="absolute -right-12 top-3 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
              Pass
            </span>
            <div className="text-[10px] text-emerald-400 uppercase">Protection Layer</div>
            <div className="text-sm font-bold text-emerald-200">RATE LIMITER (Middleware)</div>
          </div>

          <ArrowDown className="w-4 h-4 text-emerald-400" />

          {/* Node 3: Redis Cache Lookup */}
          <div className={`w-72 p-3 rounded-lg border text-center shadow-md transition-all ${
            isCached 
              ? 'bg-amber-950/60 border-amber-400 shadow-glow-amber text-amber-300' 
              : 'bg-slate-900/80 border-slate-700 text-slate-200'
          }`}>
            <div className="text-[10px] text-amber-400 uppercase">L1 In-Memory Cache</div>
            <div className="text-sm font-bold">REDIS CACHE LOOKUP (ioredis)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">TTL: 3600s · Graceful In-Memory Fallback</div>
          </div>

          <div className="flex items-center gap-8 my-1 text-[11px]">
            <span className="text-amber-400">Cache Hit ➔ Return Cached</span>
            <span className="text-slate-500">│ Miss ➔ Fall Through</span>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Node 4: MongoDB Atlas Lookup */}
          <div className="w-72 p-3 rounded-lg bg-slate-900/80 border border-slate-700 text-center shadow-md">
            <div className="text-[10px] text-emerald-400 uppercase">L2 Persistence Layer</div>
            <div className="text-sm font-bold text-slate-100">MONGODB PERSISTENCE LOOKUP</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mongoose Model · In-Memory Fallback</div>
          </div>

          <ArrowDown className="w-4 h-4 text-cyan-400" />

          {/* Parallel Feature Extraction Pipeline matching 3 boxes in reference image */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
            {/* Box 1 */}
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center shadow-md">
              <Activity className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-[10px] text-cyan-400 uppercase">Lexical Engine</div>
              <div className="text-xs font-bold text-slate-100">STRUCTURAL FEATURE EXTRACTOR</div>
              <div className="text-[10px] text-slate-400 mt-1">IP host, length, @ symbol, TLD risk, keywords</div>
            </div>

            {/* Box 2 */}
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/40 text-center shadow-md">
              <Globe className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-[10px] text-blue-400 uppercase">Network Service</div>
              <div className="text-xs font-bold text-slate-100">WHOIS & DNS QUERY SERVICE</div>
              <div className="text-[10px] text-slate-400 mt-1">DNS A/MX/NS, ICANN RDAP, domain age audit</div>
            </div>

            {/* Box 3 */}
            <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-center shadow-md">
              <Lock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-[10px] text-purple-400 uppercase">Crypto & DOM</div>
              <div className="text-xs font-bold text-slate-100">TLS/CERTIFICATE & DOM AUDIT</div>
              <div className="text-[10px] text-slate-400 mt-1">X.509 cert validation, unencrypted forms</div>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-cyan-400" />

          {/* Node 5: Algorithmic Threat Scoring Engine */}
          <div className="w-80 p-3.5 rounded-lg bg-gradient-to-r from-red-950/80 via-amber-950/80 to-slate-900/90 border border-red-500/50 text-center shadow-glow-danger">
            <div className="text-[10px] text-red-400 uppercase">Multi-Factor Classification</div>
            <div className="text-sm font-bold text-white">SCORING ENGINE (Heuristic / ML)</div>
            <div className="text-[10px] text-amber-300 mt-1">
              Threat Score 0–100 ➔ SAFE | SUSPICIOUS | DANGEROUS
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Final Return & Cache Write */}
          <div className="w-72 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-center text-[11px] text-slate-400">
            Write to Redis (TTL: 3600s) & Save Document to DB
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
