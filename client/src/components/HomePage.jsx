import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Shield, 
  Lock, 
  Terminal, 
  Mail, 
  ChevronRight,
  ArrowRight,
  Activity
} from 'lucide-react';
import { CinematicCursor } from './CinematicCursor';

export const HomePage = ({ onNavigate, onNavigateToScanner }) => {
  const rightContainerRef = useRef(null);
  const videoRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [isVideoReady, setIsVideoReady] = useState(false);

  // Helper to navigate to a specific page
  const handleGoTo = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else if (onNavigateToScanner) {
      onNavigateToScanner();
    }
  };

  // Mouse interaction state with smooth lerping (No React state re-renders on mousemove)
  const mouseStateRef = useRef({
    currentNormalizedX: 0.0,
    targetNormalizedX: 0.0,
    isHovering: false,
    lerpFactor: 0.085
  });

  // Handle video ready state (prevents black frames / flickers on first paint)
  const handleLoadedData = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      // Prime immediately to first frame
      video.currentTime = 0.001;
      setIsVideoReady(true);
    }
  }, []);

  // Optimized render loop using requestAnimationFrame (No direct currentTime calls on raw mousemove)
  useEffect(() => {
    const renderLoop = () => {
      const state = mouseStateRef.current;
      const video = videoRef.current;

      // Smooth Linear Interpolation (lerp factor: 0.085)
      state.currentNormalizedX += (state.targetNormalizedX - state.currentNormalizedX) * state.lerpFactor;

      if (video && video.duration && !isNaN(video.duration)) {
        const duration = video.duration;
        // Map horizontal cursor movement across active tracking zone smoothly to video frame timeline
        const targetTime = Math.max(0.001, Math.min(duration - 0.02, state.currentNormalizedX * duration));

        // Scrub video frames cleanly without buffer delays or stutter
        if (Math.abs(video.currentTime - targetTime) > 0.012) {
          if (typeof video.fastSeek === 'function') {
            video.fastSeek(targetTime);
          } else {
            video.currentTime = targetTime;
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Mouse movement tracking across the expanded right-hand side of viewport
  const handleMouseMove = useCallback((e) => {
    const container = rightContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // Normalized X across right half interaction zone [0, 1]
    const rawX = (e.clientX - rect.left) / rect.width;
    const clampedX = Math.min(1, Math.max(0, rawX));

    // Update target coordinate ref ONLY (no raw video manipulation here)
    const state = mouseStateRef.current;
    state.targetNormalizedX = clampedX;
    state.isHovering = true;
    state.lerpFactor = 0.085;
  }, []);

  // Mouse leave: smooth decay back to neutral resting pose (Frame 0)
  const handleMouseLeave = useCallback(() => {
    const state = mouseStateRef.current;
    state.isHovering = false;
    state.targetNormalizedX = 0.0; // Decay back to neutral frame 0
    state.lerpFactor = 0.055;      // Smooth momentum decay
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#ff2a2a] selection:text-white font-sans flex flex-col justify-between relative overflow-hidden">
      
      {/* Cinematic Custom Cursor & Ambient Glow */}
      <CinematicCursor />

      {/* 1. Header Bar: Using the exact PhishGuard AI logo and red cinematic theme */}
      <header className="border-b border-red-500/20 bg-black/90 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo matching Home Page exactly */}
          <div 
            onClick={() => handleGoTo('home')}
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
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium font-sans">
            <button
              onClick={() => handleGoTo('home')}
              className="text-white font-bold relative py-1 border-b-2 border-red-500 shadow-[0_0_8px_rgba(255,42,42,0.8)]"
            >
              Home
            </button>
            <button
              onClick={() => handleGoTo('detect')}
              className="text-slate-400 hover:text-white transition-colors py-1"
            >
              Detect
            </button>
            <button
              onClick={() => handleGoTo('scanner')}
              className="text-slate-400 hover:text-white transition-colors py-1"
            >
              Scanner
            </button>
            <button
              onClick={() => handleGoTo('features')}
              className="text-slate-400 hover:text-white transition-colors py-1"
            >
              Features
            </button>
            <button
              onClick={() => handleGoTo('how-it-works')}
              className="text-slate-400 hover:text-white transition-colors py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => handleGoTo('contact')}
              className="text-slate-400 hover:text-white transition-colors py-1"
            >
              Contact
            </button>
          </nav>

          {/* Status & Developer Identity in Red/Black Palette */}
          <div className="flex items-center flex-wrap gap-3 text-xs font-mono">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-red-500/40 text-white">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-slate-400">TELEMETRY:</span>
              <span className="text-red-400 font-bold">ARMED</span>
            </div>

            {/* Developer Credential Badge */}
            <a
              href="mailto:fakkihpunnayoor@gmail.com"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white transition-colors"
              title="Creation: fakih"
            >
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              <span>Creation: <strong className="text-white font-medium">fakih</strong></span>
            </a>

            {/* Launch Action */}
            <button
              onClick={() => handleGoTo('detect')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold font-mono text-xs shadow-glow-red transition-all"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Hero Section: Pure Black Background & Prominent 50vw Cat Container */}
      <main className="flex-1 flex items-center w-full z-10 py-0 bg-[#000000]">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center min-h-[calc(100vh-140px)]">
          
          {/* Left Column: Bold Stylized Typography matching the red/white cinematic theme */}
          <div className="lg:col-span-6 px-6 lg:px-16 xl:px-20 space-y-7 flex flex-col justify-center z-20 py-8 lg:py-0">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-widest w-fit">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Neural Cyber Defense Grid</span>
            </div>

            <div className="space-y-1 font-mono tracking-tight select-none">
              {/* Pure White */}
              <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black text-white leading-[0.95] drop-shadow-sm">
                INSPECT.
              </h1>
              {/* Neon Red matching PhishGuard AI */}
              <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black text-[#ff2a2a] leading-[0.95] drop-shadow-[0_0_40px_rgba(255,42,42,0.7)]">
                DETECT.
              </h1>
              {/* Crimson / Rose */}
              <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600 leading-[0.95]">
                NEUTRALIZE.
              </h1>
            </div>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans max-w-lg">
              Autonomous deep neural phishing detection engine. Safeguard against credential harvesting, zero-day spoofing, and deceptive domains in real time.
            </p>

            {/* Primary Action Button: "Continue to Search & Threat Intelligence" */}
            <div className="pt-2">
              <button
                onClick={() => handleGoTo('detect')}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base tracking-widest uppercase font-mono transition-all shadow-glow-red hover:shadow-glow-red-lg active:scale-[0.98]"
              >
                <span>CONTINUE TO SEARCH &amp; THREAT INTELLIGENCE</span>
                <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Prominent Massive Cat Video covering entire right half (50vw) */}
          <div 
            ref={rightContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-6 w-full lg:w-[50vw] h-[55vh] lg:h-screen flex items-center justify-center relative cursor-crosshair select-none bg-[#000000] overflow-hidden"
          >
            {/* Direct Hardware-Accelerated Video Player with Zero-Latency Attributes */}
            <video
              ref={videoRef}
              src="/cat.mp4?v=3"
              autoPlay={true}
              muted={true}
              playsInline={true}
              preload="auto"
              fetchpriority="high"
              onLoadedData={handleLoadedData}
              onLoadedMetadata={handleLoadedData}
              className={`w-full h-full object-cover lg:object-contain scale-110 lg:scale-125 2xl:scale-135 pointer-events-none transition-opacity duration-200 ${
                isVideoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

        </div>
      </main>

      {/* 3. Footer Diagnostics in Pure Black & Red/White */}
      <footer className="border-t border-red-500/20 bg-[#000000] py-3.5 px-6 lg:px-12 text-[11px] font-mono text-slate-400 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span className="text-white font-semibold">CORE PIPELINE:</span>{' '}
            <span className="text-red-400 font-semibold">NODE.JS / REDIS / MONGO ATLAS</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">Creation:</span>{' '}
            <span className="text-red-400 font-bold">fakih</span>
            <span className="text-slate-600">•</span>
            <a 
              href="mailto:fakkihpunnayoor@gmail.com" 
              className="text-slate-400 hover:text-red-400 transition-colors underline underline-offset-2"
            >
              fakkihpunnayoor@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
