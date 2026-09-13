import React from 'react';
import { MainNavbar } from './MainNavbar';
import { SecurityAwarenessSection } from './SecurityAwarenessSection';
import { MainFooter } from './MainFooter';

export const DefensePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans flex flex-col justify-between">
      {/* Navbar with active 'defense' tab */}
      <MainNavbar currentView="defense" onNavigate={onNavigate} />

      {/* Main Content: Cyber Defense Protocol Only */}
      <main className="flex-1 pt-20">
        <SecurityAwarenessSection onScrollToScanner={() => onNavigate('scanner')} />
      </main>

      {/* Footer */}
      <MainFooter onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
};

export default DefensePage;
