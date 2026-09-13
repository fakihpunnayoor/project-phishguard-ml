import React from 'react';
import { AlertCircle, Eye, ShieldAlert, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const SecurityAwarenessSection = ({ onScrollToScanner }) => {
  const tips = [
    {
      icon: <Eye className="w-6 h-6 text-red-400" />,
      title: "1. Inspect the Full URL Domain",
      description: "Look beyond the logo on the page. Examine the address bar for hyphenated impostors, misspelled brand names, or deceptive subdomains like verify.bank.com.scam-domain.xyz.",
      badge: "DOMAIN SPOOFING"
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-amber-400" />,
      title: "2. Beware of Artificial Urgency",
      description: "Cybercriminals design phishing attacks to induce immediate panic: 'Your account will be terminated in 12 hours' or 'Unusual charge detected'. Always verify independently.",
      badge: "SOCIAL ENGINEERING"
    },
    {
      icon: <Lock className="w-6 h-6 text-red-400" />,
      title: "3. Check Encryption & Certificate Trust",
      description: "Legitimate enterprise services enforce valid, issued TLS certificates. Never enter credentials into plaintext HTTP forms or sites with browser certificate mismatch warnings.",
      badge: "TLS VERIFICATION"
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
      title: "4. Run PhishGuard Autonomous Scans",
      description: "Never test suspicious links by clicking them directly in your primary browser. Paste the raw URL into PhishGuard AI for sandboxed machine learning threat analysis.",
      badge: "AI MITIGATION"
    }
  ];

  return (
    <section id="awareness" className="py-24 relative bg-[#05070c] border-t border-red-500/10 overflow-hidden">
      {/* Subtle glowing orb */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-widest mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span>Cyber Defense Protocol</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Think Before{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-300">
              You Click.
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Human error accounts for over 82% of enterprise security breaches. Master these 4 frontline defensive checks before submitting passwords or personal identifiers.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {tips.map((tip, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-[#090d14]/90 border border-slate-800 hover:border-red-500/50 hover:shadow-glow-red transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {tip.icon}
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-400 font-semibold tracking-wider">
                  {tip.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 font-sans">
                {tip.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Callout Strip */}
        <div className="rounded-2xl bg-gradient-to-r from-red-950/40 via-black to-red-950/40 border border-red-500/30 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-red-400 font-mono text-xs uppercase tracking-wider font-bold">
              <CheckCircle2 className="w-4 h-4 text-red-500" />
              <span>Zero Risk Pre-Scan Assurance</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Have a suspicious link right in your clipboard?
            </h3>
            <p className="text-slate-400 text-sm">
              Do not open it in your browser. Inspect it immediately with PhishGuard AI's multi-layered machine learning scanner.
            </p>
          </div>

          {onScrollToScanner && (
            <button
              onClick={onScrollToScanner}
              className="shrink-0 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-sm font-bold tracking-wide shadow-glow-red transition-all flex items-center gap-2 group"
            >
              <span>Scan Suspicious URL</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SecurityAwarenessSection;
