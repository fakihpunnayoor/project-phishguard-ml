import React from 'react';
import { Link2, Brain, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorksSection = ({ onExploreFeatures }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const steps = [
    {
      number: '1',
      icon: Link2,
      title: 'Enter URL',
      description: 'Paste the suspicious website link.',
    },
    {
      number: '2',
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our ML model analyzes key patterns and features.',
    },
    {
      number: '3',
      icon: ShieldCheck,
      title: 'Get Result',
      description: "Know instantly if it's Safe or Phishing.",
    }
  ];

  return (
    <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Copy matching Reference Image 1 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs sm:text-sm font-mono tracking-[0.2em] text-red-500 font-extrabold uppercase">
              HOW IT WORKS
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Simple Steps.<br />
              <span className="text-red-500 drop-shadow-[0_0_25px_rgba(255,42,42,0.5)]">
                Stronger Protection.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Our machine learning model analyzes multiple features of a website to detect phishing attempts with high accuracy.
            </p>

            <button
              onClick={() => onExploreFeatures ? onExploreFeatures() : scrollTo('features')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black hover:bg-slate-900 border border-red-500/70 hover:border-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-glow-red-sm transition-all"
            >
              <span>Explore Features</span>
              <ArrowRight className="w-4 h-4 text-red-500" />
            </button>
          </div>

          {/* Right Column: 3 Stepper Circles with Connectors matching Reference Image 1 */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center relative group">
                    {/* Step Number Tag */}
                    <span className="text-xs font-mono font-bold text-red-500 mb-2">
                      {step.number}
                    </span>

                    {/* Circular Step Frame matching Reference Image 1 */}
                    <div className="relative w-20 h-20 rounded-full bg-black border-2 border-red-500/60 group-hover:border-red-500 flex items-center justify-center text-white shadow-glow-red-sm group-hover:shadow-glow-red transition-all mb-4">
                      <Icon className="w-8 h-8 text-red-500" />
                    </div>

                    {/* Step Title & Description */}
                    <h3 className="text-base font-bold text-white font-sans mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-[180px]">
                      {step.description}
                    </p>

                    {/* Connecting Arrow (Desktop only between items) */}
                    {idx < 2 && (
                      <div className="hidden sm:block absolute top-12 -right-4 text-slate-600 font-mono text-lg pointer-events-none">
                        →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Quote & Stay Ahead Threat Banner matching bottom of Reference Image 1 */}
        <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Quote */}
          <div className="p-6 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
            <blockquote className="text-sm sm:text-base italic text-slate-300 font-sans">
              "Technology is most powerful when it protects people."
            </blockquote>
            <div className="text-xs font-mono text-red-400 mt-2 font-semibold">
              — PhishGuard AI
            </div>
          </div>

          {/* Threat Callout Banner */}
          <div className="text-center md:text-right font-sans">
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-red-500 font-bold mb-1">
              STAY AHEAD OF THREATS
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              See the threat.<br />
              <span className="text-red-500 drop-shadow-[0_0_20px_rgba(255,42,42,0.6)]">
                Stop the attack.
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
