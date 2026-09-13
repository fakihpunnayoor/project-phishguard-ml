import React from 'react';
import { Cpu, Globe, ShieldAlert, FileSearch, Lock, Zap } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Cpu,
      title: 'Machine Learning Detection',
      description: 'Autonomous multi-factor heuristic model assessing URL structural patterns and risk weighting in real time.',
      tag: 'Live Engine',
    },
    {
      icon: FileSearch,
      title: 'URL Feature Analysis',
      description: 'Extracts critical structural telemetry including IP hostnames, @ credential spoofing, double slash redirects, and high-risk TLDs.',
      tag: 'Structural Audit',
    },
    {
      icon: ShieldAlert,
      title: 'Dynamic Risk Indicators',
      description: 'Generates concrete explainable security triggers categorized into Critical, High, Medium, and Low severity tiers.',
      tag: 'Explainability',
    },
    {
      icon: Globe,
      title: 'Live DNS & WHOIS Verification',
      description: 'Direct querying of DNS A/MX/NS records and ICANN RDAP registration timestamps to identify high-risk newly registered domains.',
      tag: 'Network Intelligence',
    },
    {
      icon: Lock,
      title: 'Cryptographic & DOM Audit',
      description: 'Inspects TLS certificate validity, remaining days, and scans DOM forms for unencrypted password transmissions.',
      tag: 'Transport Security',
    },
    {
      icon: Zap,
      title: 'Sub-Millisecond Redis Caching',
      description: 'High-performance Redis cache with 3600s TTL and resilient in-memory fallback delivering zero-latency repeated scans.',
      tag: '0ms Response',
    },
  ];

  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-xs sm:text-sm font-mono tracking-[0.2em] text-red-500 font-extrabold uppercase">
            TECHNICAL CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Engineered for Precision.<br />
            <span className="text-red-500 drop-shadow-[0_0_25px_rgba(255,42,42,0.4)]">
              Advanced Threat Intelligence.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans">
            PhishGuard AI combines multi-layer lexical heuristics, cryptographic auditing, and autonomous scoring into an integrated cybersecurity platform.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-black/70 border border-white/10 hover:border-red-500/50 backdrop-blur-xl transition-all hover:shadow-[0_0_30px_rgba(255,42,42,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform shadow-glow-red-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black border border-slate-700 text-slate-300">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-sans mb-2 group-hover:text-red-400 transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>PhishGuard Core</span>
                  <span className="text-red-500 font-bold">READY</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
