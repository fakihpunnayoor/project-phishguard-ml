import React from 'react';
import { Shield, Lock, ArrowUp, Mail, ExternalLink } from 'lucide-react';

export const MainFooter = ({ onNavigate, onScrollToTop }) => {
  const handleNav = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
    } else {
      window.location.hash = pageId === 'home' ? '' : pageId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#020408] border-t border-red-500/20 text-slate-400 font-sans relative overflow-hidden">
      {/* Red accent line top glow */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(255,42,42,0.8)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/30 to-black border border-red-500/70 shadow-glow-red group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-red-500" />
                <Lock className="w-2.5 h-2.5 text-white absolute" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-xl font-extrabold tracking-wide text-white">
                    PhishGuard
                  </span>
                  <span className="text-xl font-extrabold tracking-wide text-red-500 drop-shadow-[0_0_12px_rgba(255,42,42,0.8)]">
                    AI
                  </span>
                </div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">
                  DETECT • ANALYZE • PROTECT
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Cinematic machine learning phishing detection platform engineered to eliminate digital deception. Combines sub-second lexical heuristic extraction, DNS triangulation, and real-time WHOIS forensics.
            </p>

            <div className="pt-2 font-mono text-xs text-slate-400 space-y-1">
              <div className="text-white font-semibold flex items-center gap-2">
                <span>Creation:</span>
                <span className="text-red-400">fakih</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <a 
                  href="mailto:fakkihpunnayoor@gmail.com" 
                  className="hover:text-red-300 transition-colors underline underline-offset-4"
                >
                  fakkihpunnayoor@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
              Platform Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-red-400 transition-colors">
                  Intro Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('detect')} className="hover:text-red-400 transition-colors">
                  Detect Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-red-400 transition-colors">
                  AI Threat Scanner
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-red-400 transition-colors">
                  Technical Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-red-400 transition-colors">
                  System Architecture
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('defense')} className="hover:text-red-400 transition-colors">
                  Cyber Defense Protocol
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-red-400 transition-colors">
                  Contact Creator
                </button>
              </li>
            </ul>
          </div>

          {/* Defense Capabilities (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
              Defense Intelligence
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Lexical Heuristic Extraction</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>TLS / SSL Certificate Trust</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>WHOIS Domain Age Triangulation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Unencrypted Form Trap Detection</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>In-Memory Threat Result Cache</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
              Action
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => handleNav('scanner')}
                className="w-full py-2.5 px-3 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-mono font-bold tracking-wider transition-all shadow-glow-red"
              >
                Scan Target URL
              </button>

              <button
                onClick={onScrollToTop || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
                className="w-full py-2 px-3 rounded-lg bg-black hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} PhishGuard AI. All rights reserved. • <span className="text-slate-400">Creation: fakih</span>
          </div>

          <div className="flex items-center gap-6">
            <span onClick={() => handleNav('defense')} className="hover:text-slate-300 cursor-pointer">Security Protocol</span>
            <span onClick={() => handleNav('features')} className="hover:text-slate-300 cursor-pointer">Telemetry Terms</span>
            <span onClick={() => handleNav('contact')} className="hover:text-slate-300 cursor-pointer">Contact fakih</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
