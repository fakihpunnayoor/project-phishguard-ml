import React from 'react';
import { ShieldCheck, Cpu, Zap, Lock, Globe, Server, Activity, ArrowRight } from 'lucide-react';

export const AboutSection = ({ onScrollToScanner }) => {
  const pillars = [
    {
      icon: <Cpu className="w-5 h-5 text-red-400" />,
      title: "Multi-Vector Deep Neural Analysis",
      description: "Extracts and evaluates 40+ lexical patterns, entropy measures, and token markers directly from suspicious URLs."
    },
    {
      icon: <Zap className="w-5 h-5 text-red-400" />,
      title: "Sub-Second Threat Verdicts",
      description: "High-throughput asynchronous inspection pipeline delivers comprehensive risk assessments in under 350ms."
    },
    {
      icon: <Globe className="w-5 h-5 text-red-400" />,
      title: "Real-Time WHOIS & DNS Triangulation",
      description: "Correlates newly registered domain ages, suspicious registrar reputation, and nameserver anomalies instantaneously."
    },
    {
      icon: <Lock className="w-5 h-5 text-red-400" />,
      title: "Credential Harvesting Protection",
      description: "Inspects live form submission routes and detects unencrypted authentication traps before credentials leak."
    }
  ];

  return (
    <section id="about" className="py-24 relative bg-black overflow-hidden border-t border-red-500/10">
      {/* Background cyber grid & glow effects */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Narrative & Pillars */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-widest mb-4">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>System Architecture & Overview</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Smarter Detection.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-300">
                Stronger Protection.
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
              Phishing campaigns mutate within minutes to bypass legacy URL blocklists. PhishGuard AI leverages advanced machine learning, lexical heuristic models, and real-time network telemetry to identify and dismantle deceptive threats before they reach your inbox or credentials.
            </p>

            {/* Feature Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {pillars.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-[#0d1117]/80 border border-slate-800 hover:border-red-500/40 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-950/50 border border-red-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5 font-sans">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            {onScrollToScanner && (
              <button
                onClick={onScrollToScanner}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-sm font-bold tracking-wide shadow-glow-red transition-all group"
              >
                <span>Test Live Scanner Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* Right Column: High-Tech Cyber Defense HUD Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#090d14]/90 border border-red-500/30 p-6 shadow-2xl backdrop-blur-xl">
              {/* Corner tech accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500" />

              {/* HUD Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold text-white">AUTONOMOUS DEFENSE GRID</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  LIVE & ONLINE
                </span>
              </div>

              {/* Telemetry Visuals */}
              <div className="space-y-4 font-mono">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Neural Ensemble Accuracy</span>
                    <span className="text-white font-bold">98.7%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full w-[98.7%]" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Lexical Heuristic Filter Rate</span>
                    <span className="text-white font-bold">99.4%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full w-[99.4%]" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Zero-Day Domain Interception</span>
                    <span className="text-white font-bold">96.8%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full w-[96.8%]" />
                  </div>
                </div>

                {/* Status Box */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800/80 mt-6 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Active Telemetry Nodes:</span>
                    <span className="text-red-400">12 Distributed</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Avg Threat Latency:</span>
                    <span className="text-emerald-400">&lt; 350 ms</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Detection Engine:</span>
                    <span className="text-slate-200">v3.4-neural-prod</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 flex items-center gap-2.5 text-[11px] text-red-300">
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Continuous protection powered by real-time threat telemetry</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
