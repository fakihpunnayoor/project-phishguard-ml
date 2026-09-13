import React from 'react';
import { HeroVisual } from './HeroVisual';
import { Zap, Brain, Shield, ArrowRight } from 'lucide-react';

export const HeroSection = ({ onStartScanning, onLearnMore }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="relative pt-28 sm:pt-36 pb-16 overflow-hidden">
      {/* Background Volumetric Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-red-900/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          
          {/* Left Column: Typography & CTAs matching Reference Image 1 */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            {/* Eyebrow matching Reference Image 1 */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-[0.25em] text-red-500 font-extrabold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              <span>AI POWERED CYBER SECURITY</span>
            </div>

            {/* Main Headline matching Reference Image 1 */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.05] font-sans">
              Detect Phishing<br />
              <span className="text-red-500 drop-shadow-[0_0_35px_rgba(255,42,42,0.65)]">
                Before It Hurts.
              </span>
            </h1>

            {/* Description matching Reference Image 1 */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-xl mx-auto lg:mx-0">
              PhishGuard AI uses advanced machine learning to detect malicious websites and keep you safe online.
            </p>

            {/* 3 Mini Feature Highlights matching Reference Image 1 */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-md mx-auto lg:mx-0">
              {/* Feature 1 */}
              <div className="flex flex-col items-center lg:items-start gap-1">
                <div className="w-7 h-7 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white font-sans mt-1">Fast Detection</span>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center lg:items-start gap-1">
                <div className="w-7 h-7 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white font-sans mt-1">AI Powered Accuracy</span>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center lg:items-start gap-1">
                <div className="w-7 h-7 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white font-sans mt-1">A Safer Internet</span>
              </div>
            </div>

            {/* CTA Buttons matching Reference Image 1 */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {/* Primary: Start Scanning */}
              <button
                onClick={() => onStartScanning ? onStartScanning() : scrollTo('scanner')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-600 text-white font-mono text-sm font-bold tracking-wider uppercase transition-all shadow-glow-red hover:shadow-glow-red-lg active:scale-95"
              >
                <span>Start Scanning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary: Learn More */}
              <button
                onClick={() => onLearnMore ? onLearnMore() : scrollTo('how-it-works')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-black/60 hover:bg-slate-900 text-slate-200 hover:text-white font-mono text-sm font-semibold border border-slate-700 hover:border-red-500/50 transition-all backdrop-blur-md"
              >
                <span>Learn More</span>
              </button>
            </div>
          </div>

          {/* Right Column: Cinematic Cybersecurity Visual matching Reference Image 1 */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <HeroVisual />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
