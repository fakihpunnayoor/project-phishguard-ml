import React, { useState, useEffect } from 'react';
import { MainNavbar } from './MainNavbar';
import { HeroSection } from './HeroSection';
import { ScannerCard } from './ScannerCard';
import { ThreatResultDashboard } from './ThreatResultDashboard';
import { MetricsBar } from './MetricsBar';
import { HowItWorksSection } from './HowItWorksSection';
import { FeaturesSection } from './FeaturesSection';
import { AboutSection } from './AboutSection';
import { SecurityAwarenessSection } from './SecurityAwarenessSection';
import { ContactSection } from './ContactSection';
import { MainFooter } from './MainFooter';
import { BreakdownModal } from './BreakdownModal';
import { PipelineModal } from './PipelineModal';
import { scanUrl, getScanHistory, getScanStats } from '../services/api';
import { AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';

export const MainPage = ({ onNavigateToIntro }) => {
  // Baseline initial state matching reference layout image
  const defaultScanResult = {
    url: 'http://verify-bank.com/secure/login',
    normalizedUrl: 'http://verify-bank.com/secure/login',
    domain: 'verify-bank.com',
    threatScore: 92,
    riskCategory: 'DANGEROUS',
    lexicalScore: 85,
    contentScore: 95,
    networkScore: 90,
    triggeredIndicators: [
      {
        indicator: 'IP_HOSTNAME_DETECTED',
        title: 'IP address detected in URL',
        description: 'Target hostname or direct host address bypasses standard domain name reputation filters',
        severity: 'CRITICAL',
        scorePenalty: 35
      },
      {
        indicator: 'CONTAINS_KEYWORD_LOGIN',
        title: 'Contains keyword \'login\'',
        description: 'Target features high-risk credential solicitation tokens ("verify", "bank", "login")',
        severity: 'HIGH',
        scorePenalty: 30
      },
      {
        indicator: 'HIGH_NUMBER_REDIRECTS',
        title: 'High number of redirects',
        description: 'Consecutive redirect patterns or path delimiters detected in request route',
        severity: 'HIGH',
        scorePenalty: 20
      },
      {
        indicator: 'INSECURE_AUTH_FORM',
        title: 'Unencrypted Authentication Form',
        description: 'Password and credential input submitted over unencrypted plaintext HTTP protocol',
        severity: 'CRITICAL',
        scorePenalty: 40
      }
    ],
    whoisData: {
      domainAgeDays: 12,
      registrar: 'SuspectReg.com',
      createdDate: '2026-09-01',
      expiresDate: '2027-09-01',
      nameServers: ['ns1.bulletproof-dns.net', 'ns2.bulletproof-dns.net']
    },
    tlsData: {
      valid: false,
      authorized: false,
      issuer: 'None / Plaintext HTTP',
      subject: 'verify-bank.com',
      validFrom: 'N/A',
      validTo: 'N/A',
      daysRemaining: 0,
      protocol: 'HTTP/1.1'
    },
    dnsData: {
      aRecords: ['185.220.101.5'],
      mxRecords: [],
      nsRecords: ['ns1.bulletproof-dns.net'],
      ipAddresses: ['185.220.101.5'],
      resolved: true
    },
    contentData: {
      hasPasswordInput: true,
      hasExternalFormAction: true,
      externalActionDomains: ['exfiltrate-creds.net'],
      pageTitle: 'Online Banking - Verification Portal',
      statusCode: 200,
      isReachable: true
    },
    scanDurationMs: 412,
    cached: false
  };

  const [currentResult, setCurrentResult] = useState(defaultScanResult);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [selectedScanForModal, setSelectedScanForModal] = useState(null);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);

  // Load initial history and stats from backend API
  const loadPlatformData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.allSettled([
        getScanHistory({ limit: 20 }),
        getScanStats()
      ]);

      if (historyRes.status === 'fulfilled' && historyRes.value?.data) {
        setHistory(historyRes.value.data);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
    } catch (err) {
      console.warn('Initial platform data load notice:', err.message);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  // Handle Real URL Scan
  const handleScan = async (targetUrl) => {
    setIsLoading(true);
    setErrorToast(null);

    try {
      const response = await scanUrl(targetUrl);
      if (response.success && response.data) {
        const enriched = {
          ...response.data,
          cached: response.cached,
          cacheSource: response.cacheSource,
          scanDurationMs: response.scanDurationMs
        };
        setCurrentResult(enriched);

        // Prepend to history if new
        setHistory((prev) => {
          const exists = prev.some((h) => h._id === enriched._id);
          return exists ? prev : [enriched, ...prev];
        });

        // Refresh stats
        loadPlatformData();

        // Scroll to results cleanly
        const resultsEl = document.getElementById('results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setSuccessToast(`Scan complete for ${enriched.domain || 'target'}!`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        setErrorToast(response.message || 'Scan failed to complete');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error communicating with detection engine';
      setErrorToast(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (item) => {
    setCurrentResult(item);
    const resultsEl = document.getElementById('results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenBreakdown = (item) => {
    setSelectedScanForModal(item || currentResult);
    setIsBreakdownOpen(true);
  };

  const scrollToScanner = () => {
    const el = document.getElementById('scanner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Dynamic Toasts */}
      {errorToast && (
        <div className="fixed top-24 right-4 z-50 max-w-md p-4 rounded-xl bg-red-950/95 border border-red-500 text-red-200 shadow-2xl flex items-start gap-3 backdrop-blur-xl animate-in slide-in-from-right font-mono text-xs">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-red-300">Scan Notice</div>
            <div className="mt-0.5">{errorToast}</div>
          </div>
          <button
            onClick={() => setErrorToast(null)}
            className="text-red-400 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {successToast && (
        <div className="fixed top-24 right-4 z-50 max-w-md p-4 rounded-xl bg-emerald-950/95 border border-emerald-500 text-emerald-200 shadow-2xl flex items-start gap-3 backdrop-blur-xl animate-in slide-in-from-right font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-emerald-300">Analysis Verdict Ready</div>
            <div className="mt-0.5">{successToast}</div>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-400 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Cinematic Sticky Navigation Bar */}
      <MainNavbar
        onNavigateToIntro={onNavigateToIntro}
        onScrollToScanner={scrollToScanner}
      />

      <main>
        {/* 2. Cinematic Hero Section with Cyber Guardian, Shield, Globe & HUD */}
        <HeroSection onScrollToScanner={scrollToScanner} />

        {/* 3. High-Tech Glassmorphic Scanner Card with URL Input & Presets */}
        <ScannerCard
          onScan={handleScan}
          isLoading={isLoading}
        />

        {/* 4. Live Threat Result Dashboard (Replicating Reference Image 2 in Neon-Red/Black) */}
        <ThreatResultDashboard
          scanResult={currentResult}
          history={history}
          onSelectScan={handleSelectFromHistory}
          onInspectBreakdown={handleOpenBreakdown}
        />

        {/* 5. Metrics Counter Strip */}
        <MetricsBar />

        {/* 6. How PhishGuard AI Works (3-Step Circular Process + Quote) */}
        <HowItWorksSection onScrollToScanner={scrollToScanner} />

        {/* 7. Technical Capabilities & Engines Grid (6 Cards) */}
        <FeaturesSection />

        {/* 8. About Section ('Smarter Detection. Stronger Protection.') */}
        <AboutSection onScrollToScanner={scrollToScanner} />

        {/* 9. Security Awareness Section ('Think Before You Click.') */}
        <SecurityAwarenessSection onScrollToScanner={scrollToScanner} />

        {/* 10. Creator & Contact Section ('Creation: fakih' & 'fakkihpunnayoor@gmail.com') */}
        <ContactSection />
      </main>

      {/* 11. Cinematic Footer */}
      <MainFooter onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      {/* Forensic Deep Inspection Modal */}
      <BreakdownModal
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        scanData={selectedScanForModal}
      />

      {/* Pipeline Visualizer Modal */}
      <PipelineModal
        isOpen={isPipelineOpen}
        onClose={() => setIsPipelineOpen(false)}
        isCached={currentResult?.cached}
      />
    </div>
  );
};

export default MainPage;
