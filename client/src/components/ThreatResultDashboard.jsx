import React, { useState } from 'react';
import { WhoisCard } from './WhoisCard';
import { RiskCard } from './RiskCard';
import { ScoringCard } from './ScoringCard';
import { HistoryTable } from './HistoryTable';
import { ShieldCheck, ShieldAlert, AlertTriangle, Zap, Clock, ExternalLink, ArrowUpRight, Activity } from 'lucide-react';

export const ThreatResultDashboard = ({
  scanResult,
  history = [],
  onSelectScan,
  onInspectBreakdown
}) => {
  const [showFullHistory, setShowFullHistory] = useState(false);

  if (!scanResult) return null;

  const {
    url,
    domain,
    threatScore = 0,
    riskCategory = 'SAFE',
    lexicalScore = 0,
    contentScore = 0,
    triggeredIndicators = [],
    whoisData = {},
    tlsData = {},
    dnsData = {},
    cached = false,
    cacheSource = 'PIPELINE_ENGINE',
    scanDurationMs = 0
  } = scanResult;

  const isDangerous = riskCategory === 'DANGEROUS';
  const isSuspicious = riskCategory === 'SUSPICIOUS';
  const isSafe = riskCategory === 'SAFE';

  // Circular SVG Threat Score Gauge
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * threatScore) / 100;

  const scoreStrokeColor = isDangerous ? '#ff2a3b' : isSuspicious ? '#f59e0b' : '#10b981';

  return (
    <section id="results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 animate-in fade-in duration-500">
      {/* 1. Result Header Banner matching Reference Image 1 & 2 integration */}
      <div className={`relative rounded-2xl p-6 sm:p-8 backdrop-blur-xl border mb-8 transition-all ${
        isDangerous
          ? 'bg-gradient-to-r from-red-950/70 via-black to-black border-red-500/50 shadow-[0_0_40px_rgba(255,42,42,0.25)]'
          : isSuspicious
          ? 'bg-gradient-to-r from-amber-950/70 via-black to-black border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
          : 'bg-gradient-to-r from-emerald-950/70 via-black to-black border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.25)]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Status Left */}
          <div className="flex items-start gap-4">
            {/* Dynamic Status Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
              isDangerous
                ? 'bg-red-950/80 border-red-500 text-red-500 shadow-glow-red'
                : isSuspicious
                ? 'bg-amber-950/80 border-amber-500 text-amber-500 shadow-glow-amber'
                : 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-glow-safe'
            }`}>
              {isDangerous ? (
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              ) : isSuspicious ? (
                <AlertTriangle className="w-8 h-8" />
              ) : (
                <ShieldCheck className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <span className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded tracking-widest border ${
                  isDangerous
                    ? 'bg-red-900/80 text-white border-red-500'
                    : isSuspicious
                    ? 'bg-amber-900/80 text-amber-200 border-amber-500'
                    : 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
                }`}>
                  {riskCategory}
                </span>

                {cached && (
                  <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-black/70 border border-slate-700 text-slate-300">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Cached ({cacheSource} · {scanDurationMs}ms)</span>
                  </span>
                )}

                {scanResult?.mlPrediction && (
                  <span className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded border ${
                    scanResult.mlPrediction.label === 'PHISHING'
                      ? 'bg-red-950/80 text-red-300 border-red-500/60'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    <span>ML Classifier: <strong>{scanResult.mlPrediction.label}</strong> ({(scanResult.mlPrediction.confidence || 98).toFixed(1)}% conf)</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-sans text-white break-all">
                {url}
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
                {isDangerous
                  ? 'Model Assessment: Critical threat indicators detected. High probability of phishing or credential harvesting.'
                  : isSuspicious
                  ? 'Model Assessment: Elevated risk heuristics flagged. Exercise caution before entering credentials.'
                  : 'Model Assessment: Verified clean infrastructure with zero negative heuristics detected.'}
              </p>
            </div>
          </div>

          {/* Circular Score Gauge Right */}
          <div className="flex items-center gap-6 justify-between lg:justify-end shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
            <div className="text-right font-mono">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Overall Threat Score</div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {threatScore}<span className="text-xs text-slate-500">/100</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isDangerous ? 'HIGH RISK' : isSuspicious ? 'ELEVATED' : 'MINIMAL RISK'}
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={scoreStrokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-base font-bold font-mono text-white">
                {threatScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Core Intelligence Cards from Reference Image 2 in Cinematic Red/Black Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: WHOIS & Domain Intelligence */}
        <WhoisCard
          whoisData={whoisData}
          tlsData={tlsData}
          dnsData={dnsData}
          domain={domain || 'target-domain.com'}
          onInspectMore={() => onInspectBreakdown && onInspectBreakdown(scanResult)}
        />

        {/* Card 2: Risk Triggers & Heuristics */}
        <RiskCard
          indicators={triggeredIndicators}
          riskCategory={riskCategory}
        />

        {/* Card 3: Model Scoring Breakdown & Lexical/Content Stats */}
        <ScoringCard
          mlScore={scanResult?.mlScore ?? (scanResult?.mlPrediction?.mlScore || (isDangerous ? 95 : 5))}
          mlPrediction={scanResult?.mlPrediction}
          lexicalScore={lexicalScore}
          contentScore={contentScore}
          threatScore={threatScore}
        />

        {/* Card 4: Recent Scan Logs */}
        <HistoryTable
          history={history}
          onSelectScan={onSelectScan}
          compact={true}
        />
      </div>

      {/* Action Footer to Inspect Deep Breakdown or Expand Audit Table */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-4 h-4 text-red-500" />
          <span>Detailed cryptographic and forensic parameters available for this target.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onInspectBreakdown && onInspectBreakdown(scanResult)}
            className="px-4 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/50 hover:border-red-500 transition-all font-bold flex items-center gap-1.5"
          >
            <span>View Full Breakdown</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowFullHistory(!showFullHistory)}
            className="px-4 py-2 rounded-lg bg-black hover:bg-slate-900 text-slate-300 border border-slate-700 transition-colors"
          >
            {showFullHistory ? 'Hide Audit Log Table' : 'Show All Audit Logs'}
          </button>
        </div>
      </div>

      {/* Expandable Full History Table */}
      {showFullHistory && (
        <div className="mt-6 animate-in slide-in-from-top duration-300">
          <HistoryTable
            history={history}
            onSelectScan={onSelectScan}
            onInspectBreakdown={onInspectBreakdown}
            compact={false}
          />
        </div>
      )}
    </section>
  );
};

export default ThreatResultDashboard;
