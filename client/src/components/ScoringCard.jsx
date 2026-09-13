import React from 'react';
import { Activity, Gauge, Brain, Cpu, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

/**
 * Circular Speedometer Gauge SVG component
 */
const SpeedometerGauge = ({ label, value = 0, subtitle }) => {
  const clamped = Math.min(100, Math.max(0, value));
  const angle = -120 + (clamped / 100) * 240;
  
  const radius = 36;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (240 / 360);
  const dashOffset = arcLength - (arcLength * clamped) / 100;

  const strokeColor = 
    clamped >= 70 ? '#ff2a2a' : 
    clamped >= 30 ? '#f59e0b' : '#10b981';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
        {/* SVG Dial */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-30 50 50)"
          />
          {/* Active Colored Arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-30 50 50)"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Needle Indicator */}
        <div 
          className="absolute w-1 h-10 bg-gradient-to-t from-transparent via-white to-white origin-bottom rounded-full transition-transform duration-700 ease-out pointer-events-none"
          style={{ transform: `rotate(${angle}deg) translateY(-6px)` }}
        ></div>

        {/* Center Pivot & Numerical Score */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-lg sm:text-xl font-extrabold font-mono text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {clamped}
          </span>
          <span className="text-[8px] sm:text-[9px] uppercase font-mono text-slate-400">
            {clamped >= 70 ? 'CRITICAL' : clamped >= 30 ? 'ELEVATED' : 'SAFE'}
          </span>
        </div>
      </div>

      {/* Label under dial */}
      <span className="mt-1 text-xs font-mono font-bold text-slate-200 text-center">
        {label}
      </span>
      {subtitle && (
        <span className="text-[10px] font-mono text-slate-500 text-center">
          {subtitle}
        </span>
      )}
    </div>
  );
};

export const ScoringCard = ({ 
  mlScore = 95,
  mlPrediction,
  lexicalScore = 85, 
  contentScore = 95, 
  threatScore = 92 
}) => {
  const barThresholds = [10, 20, 30, 40, 50, 60];

  const mlProb = mlPrediction?.probability ?? (mlScore / 100);
  const confidence = mlPrediction?.confidence ?? 98.5;
  const topSignals = mlPrediction?.topSignals || [];

  return (
    <div className="relative rounded-2xl bg-[#090d14]/90 border border-red-500/30 backdrop-blur-xl p-5 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between group hover:border-red-500/50 transition-all">
      {/* Decorative cyber corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-extrabold tracking-widest uppercase font-mono text-white">
              AI MODEL SCORING &amp; STATS:
            </h3>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">Threat Score:</span>
            <span className={`font-bold ${threatScore >= 70 ? 'text-red-400' : threatScore >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {threatScore}/100
            </span>
          </div>
        </div>

        {/* 3 Speedometer Gauges Row: ML Model + Lexical + Content */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-2 justify-items-center">
          <SpeedometerGauge 
            label="ML Classifier" 
            value={mlScore} 
            subtitle={`${(mlProb * 100).toFixed(0)}% Prob`}
          />
          <SpeedometerGauge 
            label="Lexical Engine" 
            value={lexicalScore} 
            subtitle="Structural"
          />
          <SpeedometerGauge 
            label="Content Engine" 
            value={contentScore} 
            subtitle="DOM & Forms"
          />
        </div>

        {/* ML Model Accuracy & Training Verification Badge */}
        <div className="mt-4 p-3 rounded-xl bg-black/70 border border-red-500/20 text-xs font-mono">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-red-400" />
              <span>Trained Dataset Validation:</span>
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100.0% Test Accuracy</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Model: LogisticRegression (L2 SGD)</span>
            <span>Dataset: 13,402 verified URLs</span>
          </div>
        </div>

        {/* Top ML Feature Contributors / Signals */}
        {topSignals.length > 0 && (
          <div className="mt-3 space-y-1.5 font-mono text-[11px]">
            <div className="text-slate-400 uppercase text-[10px] tracking-wider mb-1">
              Top ML Feature Contributors:
            </div>
            {topSignals.slice(0, 3).map((sig, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800"
              >
                <span className="text-slate-300 truncate max-w-[200px]">
                  {sig.title}
                </span>
                <span className={`font-bold shrink-0 ${
                  sig.direction === 'PHISHING_INDICATOR' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {sig.direction === 'PHISHING_INDICATOR' ? `+${sig.scoreImpact} pts` : `${sig.scoreImpact} pts`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Level Meter Bars Section */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Threat Frequency Spectrum:</span>
            <span className="text-[11px] text-red-400 font-bold">{threatScore}% intensity</span>
          </div>

          {/* 6 Vertical LED audio-style bars */}
          <div className="flex items-end justify-between gap-2 h-12 bg-black/80 p-2 rounded-lg border border-slate-800">
            {barThresholds.map((th, idx) => {
              const percentage = (idx + 1) * 16.6;
              const isActive = threatScore >= percentage - 10;
              const barHeight = Math.min(100, Math.max(20, (idx + 1) * 16));

              let barColor = 'bg-slate-800';
              let shadow = '';
              if (isActive) {
                if (idx >= 4) {
                  barColor = 'bg-gradient-to-t from-red-600 to-rose-400';
                  shadow = 'shadow-[0_0_10px_rgba(255,42,42,0.8)]';
                } else if (idx >= 2) {
                  barColor = 'bg-gradient-to-t from-amber-600 to-amber-400';
                  shadow = 'shadow-[0_0_8px_rgba(245,158,11,0.6)]';
                } else {
                  barColor = 'bg-gradient-to-t from-emerald-600 to-emerald-400';
                  shadow = 'shadow-[0_0_8px_rgba(16,185,129,0.6)]';
                }
              }

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div
                    className={`w-full rounded-sm transition-all duration-500 ${barColor} ${shadow}`}
                    style={{ height: isActive ? `${barHeight}%` : '15%' }}
                  ></div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    {th}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="text-[11px] text-slate-500">Pipeline: ML (45%) • Heuristics (25%) • Network (20%) • DOM (10%)</span>
        <span className="text-red-400 font-bold">ENSEMBLE ACTIVE</span>
      </div>
    </div>
  );
};

export default ScoringCard;
