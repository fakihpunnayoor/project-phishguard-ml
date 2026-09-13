import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { DetectPage } from './components/DetectPage';
import { ScannerPage } from './components/ScannerPage';
import { FeaturesPage } from './components/FeaturesPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { DefensePage } from './components/DefensePage';
import { ContactPage } from './components/ContactPage';

export function App() {
  // View State Controller ('home' | 'detect' | 'scanner' | 'features' | 'how-it-works' | 'defense' | 'contact')
  // Default opens directly on 'home' (Intro Page with interactive cat)
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '').replace('/', '');
    const validViews = ['home', 'detect', 'scanner', 'features', 'how-it-works', 'defense', 'contact'];
    if (validViews.includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === 'home') {
      // Clean URL on home view
      if (window.location.hash) {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize browser forward/back buttons with view state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace('/', '');
      const validViews = ['home', 'detect', 'scanner', 'features', 'how-it-works', 'defense', 'contact'];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
      } else if (!hash) {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] selection:bg-[#ff2a2a] selection:text-white font-sans text-white">
      {/* 1. Home / Intro Page: Only Intro + Cat Video + Mouse Tracking + Custom Cursor */}
      {currentView === 'home' && (
        <HomePage 
          onNavigate={handleNavigate}
          onNavigateToScanner={() => handleNavigate('detect')}
        />
      )}

      {/* 2. Detect Page: Only Hero Section with Cyber Guardian */}
      {currentView === 'detect' && (
        <DetectPage onNavigate={handleNavigate} />
      )}

      {/* 3. URL Scanner Page: Only Scanner + Threat Intelligence + 4 Cinematic Navigation Buttons */}
      {currentView === 'scanner' && (
        <ScannerPage onNavigate={handleNavigate} />
      )}

      {/* 4. Features Page: Only Technical Capabilities */}
      {currentView === 'features' && (
        <FeaturesPage onNavigate={handleNavigate} />
      )}

      {/* 5. How It Works Page: Only How It Works & System Architecture */}
      {currentView === 'how-it-works' && (
        <HowItWorksPage onNavigate={handleNavigate} />
      )}

      {/* 6. Cyber Defense Protocol Page: Only Security Awareness Protocol */}
      {currentView === 'defense' && (
        <DefensePage onNavigate={handleNavigate} />
      )}

      {/* 7. Contact Page: Only Creator Details & Message Dispatch */}
      {currentView === 'contact' && (
        <ContactPage onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
