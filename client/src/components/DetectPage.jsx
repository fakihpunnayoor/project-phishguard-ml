import React from 'react';
import { MainNavbar } from './MainNavbar';
import { HeroSection } from './HeroSection';
import { MainFooter } from './MainFooter';

export const DetectPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans flex flex-col justify-between">
      {/* Navbar with active 'detect' tab */}
      <MainNavbar currentView="detect" onNavigate={onNavigate} />

      {/* Main Content: Detect Hero Section */}
      <main className="flex-1">
        <HeroSection
          onStartScanning={() => onNavigate('scanner')}
          onLearnMore={() => onNavigate('how-it-works')}
        />
      </main>

      {/* Footer */}
      <MainFooter onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
};

export default DetectPage;
