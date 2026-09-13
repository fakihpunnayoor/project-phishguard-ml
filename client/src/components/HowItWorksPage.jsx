import React from 'react';
import { MainNavbar } from './MainNavbar';
import { HowItWorksSection } from './HowItWorksSection';
import { AboutSection } from './AboutSection';
import { MainFooter } from './MainFooter';
import { Zap, ArrowRight } from 'lucide-react';

export const HowItWorksPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans flex flex-col justify-between">
      {/* Navbar with active 'how-it-works' tab */}
      <MainNavbar currentView="how-it-works" onNavigate={onNavigate} />

      {/* Main Content: How It Works & System Architecture Only */}
      <main className="flex-1 pt-20">
        {/* 1. How It Works 3-Step Process */}
        <HowItWorksSection onScrollToScanner={() => onNavigate('scanner')} />

        {/* 2. System Architecture & Overview */}
        <AboutSection onScrollToScanner={() => onNavigate('scanner')} />

        {/* Action Callout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-2xl bg-gradient-to-r from-red-950/40 via-black to-red-950/40 border border-red-500/30 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-red-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Zap className="w-4 h-4 text-red-500" />
                <span>Sub-Second Intelligence</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Inspect a suspicious target with this architecture
              </h3>
              <p className="text-slate-400 text-sm">
                Experience the asynchronous multi-vector extraction pipeline live in under 350ms.
              </p>
            </div>

            <button
              onClick={() => onNavigate('scanner')}
              className="shrink-0 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-sm font-bold tracking-wide shadow-glow-red transition-all flex items-center gap-2 group"
            >
              <span>Launch Threat Scanner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <MainFooter onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
};

export default HowItWorksPage;
