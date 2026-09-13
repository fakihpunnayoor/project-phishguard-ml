import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, Flame, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const UrlBar = ({ onScan, currentResult, isLoading }) => {
  const [inputUrl, setInputUrl] = useState('http://verify-bank.com/secure/login');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim() && !isLoading) {
      onScan(inputUrl.trim());
    }
  };

  const handlePreset = (presetUrl) => {
    setInputUrl(presetUrl);
    onScan(presetUrl);
  };

  const riskCategory = currentResult?.riskCategory || 'DANGEROUS';
  const threatScore = currentResult?.threatScore ?? 92;

  // Render the glowing 3D/faceted hexagon badge matching the reference image
  const renderRiskBadge = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/40 text-cyan-400 font-mono text-sm animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>ANALYZING...</span>
        </div>
      );
    }

    if (riskCategory === 'DANGEROUS') {
      return (
        <div className="relative group cursor-default">
          {/* Flame aura backdrop */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 rounded-lg blur-md opacity-80 group-hover:opacity-100 animate-pulse"></div>
          
          {/* 3D Faceted Hexagonal Danger Badge */}
          <div className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-gradient-to-br from-red-950/90 via-red-900/90 to-amber-950/90 border-2 border-red-500/80 text-white font-extrabold tracking-widest uppercase shadow-glow-danger font-mono">
            <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
            <span className="text-base text-red-100 drop-shadow-[0_2px_8px_rgba(255,50,50,0.8)]">
              DANGER
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-red-800/80 text-amber-300 font-mono border border-red-500/50">
              {threatScore}
            </span>
          </div>
        </div>
      );
    }

    if (riskCategory === 'SUSPICIOUS') {
      return (
        <div className="relative group cursor-default">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg blur-md opacity-75 animate-pulse"></div>
          <div className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-gradient-to-br from-amber-950/90 to-slate-900/90 border-2 border-amber-500/80 text-amber-300 font-bold tracking-wider uppercase shadow-glow-amber font-mono">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-base drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">SUSPICIOUS</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 font-mono border border-amber-500/50">
              {threatScore}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="relative group cursor-default">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg blur-md opacity-60 animate-pulse"></div>
        <div className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-gradient-to-br from-emerald-950/90 to-slate-900/90 border-2 border-emerald-500/80 text-emerald-300 font-bold tracking-wider uppercase shadow-glow-safe font-mono">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-base drop-shadow-[0_2px_8px_rgba(16,185,129,0.6)]">SAFE</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-200 font-mono border border-emerald-500/50">
            {threatScore}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-4">
      {/* Title Bar matching reference image */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide font-mono text-white flex items-center gap-3">
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]">PhishGuard</span>
            <span className="text-slate-400 font-light">–</span>
            <span className="text-slate-200 text-xl sm:text-2xl font-normal">URL Threat Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time heuristic extraction, cryptographic validation, and multi-factor classification engine
          </p>
        </div>

        {/* Cache status chip */}
        {currentResult?.cached && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Served from {currentResult.cacheSource || 'Redis'} Cache ({currentResult.scanDurationMs}ms)</span>
          </div>
        )}
      </div>

      {/* Main Live URL Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex flex-col md:flex-row items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 focus-within:border-cyan-400 focus-within:shadow-glow-cyan transition-all">
          {/* URL Input Field */}
          <div className="relative flex-1 w-full flex items-center">
            <div className="absolute left-3 text-cyan-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL to analyze (e.g., http://verify-bank.com/secure/login)..."
              className="w-full bg-slate-950/60 text-slate-100 placeholder-slate-500 text-sm sm:text-base font-mono pl-11 pr-4 py-3 rounded-lg border border-slate-700/60 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Action Button & Dynamic Risk Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Dynamic Real-time Risk Badge */}
            {renderRiskBadge()}

            {/* Run Threat Scan Button */}
            <button
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide uppercase transition-all shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed font-mono min-w-[170px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Run Threat Scan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preset Quick-Test Prompts */}
      <div className="flex items-center flex-wrap gap-2 mt-3 text-xs font-mono">
        <span className="text-slate-400">Test Heuristics:</span>
        <button
          type="button"
          onClick={() => handlePreset('http://verify-bank.com/secure/login')}
          className="px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-600/40 transition-colors flex items-center gap-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
          verify-bank.com (Phishing Demo)
        </button>
        <button
          type="button"
          onClick={() => handlePreset('http://192.168.1.105:8080/update-credential.php')}
          className="px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-600/40 transition-colors flex items-center gap-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          IP Hostname + Non-Std Port
        </button>
        <button
          type="button"
          onClick={() => handlePreset('https://github.com')}
          className="px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 transition-colors flex items-center gap-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          github.com (Verified Safe)
        </button>
        <button
          type="button"
          onClick={() => handlePreset('https://wikipedia.org')}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-colors flex items-center gap-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          wikipedia.org
        </button>
      </div>
    </section>
  );
};
