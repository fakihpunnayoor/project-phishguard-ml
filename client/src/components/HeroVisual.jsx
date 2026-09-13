import React from 'react';
import { Shield, Lock, Globe, AlertOctagon, Terminal } from 'lucide-react';

export const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl aspect-square flex items-center justify-center select-none">
      {/* Volumetric Red Atmospheric Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,30,56,0.22)_0%,rgba(180,10,30,0.08)_50%,transparent_75%)] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-red-600/20 rounded-full blur-[90px] pointer-events-none animate-pulse"></div>

      {/* Cyber Grid / Concentric Radar Circles in Background */}
      <svg className="absolute w-full h-full opacity-30 pointer-events-none" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(255, 42, 42, 0.2)" strokeDasharray="4 8" />
        <circle cx="250" cy="250" r="180" fill="none" stroke="rgba(255, 42, 42, 0.25)" strokeDasharray="2 6" />
        <circle cx="250" cy="250" r="120" fill="none" stroke="rgba(255, 42, 42, 0.35)" />
        <line x1="250" y1="20" x2="250" y2="480" stroke="rgba(255, 42, 42, 0.15)" strokeDasharray="2 4" />
        <line x1="20" y1="250" x2="480" y2="250" stroke="rgba(255, 42, 42, 0.15)" strokeDasharray="2 4" />
      </svg>

      {/* Hooded Cybersecurity Guardian Silhouette SVG */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full filter drop-shadow-[0_0_35px_rgba(255,30,56,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Red Neon Gradients */}
            <linearGradient id="hoodGrad" x1="300" y1="80" x2="300" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1a0508" />
              <stop offset="45%" stopColor="#0d0305" />
              <stop offset="100%" stopColor="#050102" />
            </linearGradient>

            <linearGradient id="hoodRim" x1="180" y1="120" x2="420" y2="420" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff2a3b" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#ff1122" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#880011" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="shieldGrad" x1="300" y1="260" x2="300" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff2a3b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#880015" stopOpacity="0.08" />
            </linearGradient>

            <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hood Silhouette */}
          {/* Outer Hood Body */}
          <path
            d="M160 520 C 170 420, 200 340, 220 220 C 230 160, 250 100, 300 100 C 350 100, 370 160, 380 220 C 400 340, 430 420, 440 520 Z"
            fill="url(#hoodGrad)"
            stroke="url(#hoodRim)"
            strokeWidth="2.5"
          />

          {/* Inner Face Void (Deep obsidian black shadow) */}
          <path
            d="M240 210 C 240 160, 265 140, 300 140 C 335 140, 360 160, 360 210 C 360 280, 335 320, 300 330 C 265 320, 240 280, 240 210 Z"
            fill="#030002"
          />

          {/* Subtle Cyber Gaze Line */}
          <line x1="280" y1="210" x2="292" y2="210" stroke="#ff2a3b" strokeWidth="2" strokeLinecap="round" filter="url(#redGlow)" />
          <line x1="308" y1="210" x2="320" y2="210" stroke="#ff2a3b" strokeWidth="2" strokeLinecap="round" filter="url(#redGlow)" />

          {/* Shoulders & Robe Lines */}
          <path d="M160 520 C 220 490, 260 470, 300 470 C 340 470, 380 490, 440 520" stroke="rgba(255, 42, 42, 0.35)" strokeWidth="1.5" />
          <path d="M190 420 C 240 390, 270 380, 300 380 C 330 380, 360 390, 410 420" stroke="rgba(255, 42, 42, 0.25)" strokeWidth="1" />

          {/* Holographic Glowing Red Shield (Center Front) matching Reference Image */}
          <g filter="url(#redGlow)">
            {/* Outer Shield Hex / Contour */}
            <path
              d="M300 270 L380 305 L380 395 C380 450, 300 480, 300 480 C300 480, 220 450, 220 395 L220 305 Z"
              fill="url(#shieldGrad)"
              stroke="#ff2a3b"
              strokeWidth="3.5"
            />
            {/* Inner Shield Accent */}
            <path
              d="M300 290 L365 318 L365 390 C365 435, 300 460, 300 460 C300 460, 235 435, 235 390 L235 318 Z"
              fill="none"
              stroke="rgba(255, 100, 100, 0.6)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          </g>

          {/* Glowing Padlock Icon Inside Shield */}
          <g transform="translate(283, 345)">
            {/* Shackle */}
            <path
              d="M7 16 V10 C7 4.5, 27 4.5, 27 10 V16"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Lock Body */}
            <rect
              x="2"
              y="15"
              width="30"
              height="24"
              rx="4"
              fill="#ff1122"
              stroke="#ffffff"
              strokeWidth="2"
              filter="url(#redGlow)"
            />
            {/* Keyhole */}
            <circle cx="17" cy="24" r="2.5" fill="#ffffff" />
            <line x1="17" y1="26" x2="17" y2="32" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Digital Earth Globe Wireframe on the Right matching Reference Image */}
          <g transform="translate(430, 230)" opacity="0.85">
            <circle cx="60" cy="60" r="55" fill="none" stroke="#ff2a3b" strokeWidth="1.5" />
            <ellipse cx="60" cy="60" rx="55" ry="24" fill="none" stroke="rgba(255, 42, 42, 0.4)" />
            <ellipse cx="60" cy="60" rx="24" ry="55" fill="none" stroke="rgba(255, 42, 42, 0.4)" />
            <line x1="5" y1="60" x2="115" y2="60" stroke="rgba(255, 42, 42, 0.5)" strokeDasharray="3 3" />
            {/* Global Node Blips */}
            <circle cx="35" cy="45" r="2.5" fill="#ff4d4d" filter="url(#redGlow)" />
            <circle cx="85" cy="55" r="2.5" fill="#ff4d4d" filter="url(#redGlow)" />
            <circle cx="60" cy="25" r="2.5" fill="#ff4d4d" filter="url(#redGlow)" />
            <circle cx="50" cy="85" r="2.5" fill="#ff4d4d" filter="url(#redGlow)" />
          </g>
        </svg>

        {/* Floating HUD Callout 1: THREATS DETECTED (Top Left of Shield) */}
        <div className="absolute top-12 left-4 sm:left-10 p-2 sm:p-2.5 rounded-lg bg-black/85 border border-red-500/60 backdrop-blur-md shadow-glow-red text-[10px] sm:text-xs font-mono text-red-400 animate-pulse">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>THREATS DETECTED</span>
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">HEURISTIC ENGINE // ARMED</div>
        </div>

        {/* Floating HUD Callout 2: Threat Categories (Right Top) matching Reference Image */}
        <div className="absolute top-14 right-2 sm:right-6 text-right font-mono text-[9px] sm:text-[10px] text-red-300 space-y-0.5 hidden sm:block">
          <div className="font-bold tracking-wider text-red-400">PHISHING</div>
          <div className="tracking-wider">MALWARE</div>
          <div className="tracking-wider">SCAMS</div>
          <div className="tracking-wider text-red-400">DATA THEFT</div>
          <div className="font-bold text-white pt-0.5">STOP HERE.</div>
        </div>

        {/* Floating HUD Callout 3: "A SAFER TOMORROW STARTS WITH AWARENESS." matching Reference Image */}
        <div className="absolute bottom-16 right-4 sm:right-10 text-right font-mono text-[9px] sm:text-[10px] text-slate-400 max-w-[140px] leading-tight hidden sm:block">
          <span className="text-white font-semibold">A SAFER TOMORROW</span> STARTS WITH AWARENESS.
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;
