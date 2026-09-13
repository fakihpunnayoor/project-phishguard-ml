import React, { useState, useEffect } from 'react';
import { Shield, Lock, Menu, X, ArrowRight, ArrowLeft } from 'lucide-react';

export const MainNavbar = ({ currentView = 'detect', onNavigate, onNavigateToIntro }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (pageId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(pageId);
    } else if (pageId === 'home' && onNavigateToIntro) {
      onNavigateToIntro();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'detect', label: 'Detect' },
    { id: 'scanner', label: 'Scanner' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-red-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-black/80 backdrop-blur-sm border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Red Shield with Lock */}
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
            <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono hidden sm:block">
              DETECT • ANALYZE • PROTECT
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium font-sans">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative py-1 transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(255,42,42,0.9)] animate-in fade-in" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Return to Intro Home Button */}
          {currentView !== 'home' && (
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-slate-900 border border-slate-700 hover:border-red-500/60 text-xs font-mono text-slate-300 hover:text-white transition-all"
              title="Back to Interactive Intro Screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Intro</span>
            </button>
          )}

          {/* Quick Scanner Action */}
          <button
            onClick={() => handleLinkClick('scanner')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all ${
              currentView === 'scanner'
                ? 'bg-red-600 text-white shadow-glow-red-lg border border-red-400'
                : 'bg-gradient-to-r from-red-600/20 via-red-500/10 to-transparent hover:from-red-600 hover:to-red-700 text-white border border-red-500/80 hover:border-red-500 shadow-glow-red hover:shadow-glow-red-lg'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>Launch Scanner</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {currentView !== 'home' && (
            <button
              onClick={() => handleLinkClick('home')}
              className="p-2 rounded-lg bg-black border border-slate-700 text-xs font-mono text-slate-300"
            >
              ← Intro
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-black/80 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-red-500/30 px-6 py-5 backdrop-blur-xl animate-in slide-in-from-top">
          <div className="flex flex-col gap-3 font-sans">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left py-2 text-base font-medium transition-colors ${
                  currentView === link.id ? 'text-red-400 font-bold' : 'text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => handleLinkClick('scanner')}
              className="w-full mt-2 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-sm font-bold uppercase tracking-wider shadow-glow-red"
            >
              Start Scanning →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNavbar;
