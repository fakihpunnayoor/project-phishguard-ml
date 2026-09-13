import React, { useState, useEffect } from 'react';
import { MainNavbar } from './MainNavbar';
import { ScannerCard } from './ScannerCard';
import { ThreatResultDashboard } from './ThreatResultDashboard';
import { MainFooter } from './MainFooter';
import { BreakdownModal } from './BreakdownModal';
import { PipelineModal } from './PipelineModal';
import { scanUrl, getScanHistory, getScanStats } from '../services/api';
import { 
  Cpu, 
  Server, 
  ShieldAlert, 
  Mail, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Layers
} from 'lucide-react';

export const ScannerPage = ({ onNavigate }) => {
  // Baseline initial state matching reference layout
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

  // Load platform data
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
      console.warn('Scan page initial load:', err.message);
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

        loadPlatformData();

        setSuccessToast(`Verdict ready for ${enriched.domain || 'target'}`);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBreakdown = (item) => {
    setSelectedScanForModal(item || currentResult);
    setIsBreakdownOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans flex flex-col justify-between">
      
      {/* Toast notifications */}
      {errorToast && (
        <div className="fixed top-24 right-4 z-50 max-w-md p-4 rounded-xl bg-red-950/95 border border-red-500 text-red-200 shadow-2xl flex items-start gap-3 backdrop-blur-xl animate-in slide-in-from-right font-mono text-xs">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-red-300">Scan Warning</div>
            <div className="mt-0.5">{errorToast}</div>
          </div>
          <button onClick={() => setErrorToast(null)} className="text-red-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {successToast && (
        <div className="fixed top-24 right-4 z-50 max-w-md p-4 rounded-xl bg-emerald-950/95 border border-emerald-500 text-emerald-200 shadow-2xl flex items-start gap-3 backdrop-blur-xl animate-in slide-in-from-right font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-emerald-300">Detection Complete</div>
            <div className="mt-0.5">{successToast}</div>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* Navbar with active 'scanner' tab */}
      <MainNavbar currentView="scanner" onNavigate={onNavigate} />

      {/* Main Content: Scanner Only */}
      <main className="flex-1 pt-24 pb-16">
        
        {/* Scanner Title Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-widest mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Real-Time Phishing Classifier</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                URL Threat Intelligence Scanner
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPipelineOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-black/60 hover:bg-slate-900 border border-slate-700 hover:border-red-500/50 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-red-400" />
                <span>Pipeline Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. URL Scanner Card */}
        <ScannerCard
          onScan={handleScan}
          isLoading={isLoading}
        />

        {/* 2. Threat Result Dashboard (Replicating Reference Image 2 in Neon-Red/Black) */}
        <ThreatResultDashboard
          scanResult={currentResult}
          history={history}
          onSelectScan={handleSelectFromHistory}
          onInspectBreakdown={handleOpenBreakdown}
        />

        {/* 3. Four Cinematic Navigation Buttons (Requirement 6) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-6">
          <div className="border-t border-red-500/20 pt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
              <Activity className="w-3.5 h-3.5 text-red-500" />
              <span>Platform Deep Navigation &amp; Security Resources</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Button 1: Technical Capabilities */}
              <button
                onClick={() => onNavigate('features')}
                className="p-5 rounded-2xl bg-[#090d14]/90 border border-slate-800 hover:border-red-500/60 hover:shadow-glow-red transition-all text-left group relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-red-400 transition-colors flex items-center justify-between">
                  <span>Technical Capabilities</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Deep ML detection engines, lexical extractors, and TLS forensics.
                </p>
              </button>

              {/* Button 2: System Architecture & Overview */}
              <button
                onClick={() => onNavigate('how-it-works')}
                className="p-5 rounded-2xl bg-[#090d14]/90 border border-slate-800 hover:border-red-500/60 hover:shadow-glow-red transition-all text-left group relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Server className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-red-400 transition-colors flex items-center justify-between">
                  <span>System Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  How PhishGuard works, 3-step pipeline, and defense grid telemetry.
                </p>
              </button>

              {/* Button 3: Cyber Defense Protocol */}
              <button
                onClick={() => onNavigate('defense')}
                className="p-5 rounded-2xl bg-[#090d14]/90 border border-slate-800 hover:border-red-500/60 hover:shadow-glow-red transition-all text-left group relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-red-400 transition-colors flex items-center justify-between">
                  <span>Cyber Defense Protocol</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Frontline defense habits: "Think Before You Click" guidance.
                </p>
              </button>

              {/* Button 4: Get in Touch with Creator */}
              <button
                onClick={() => onNavigate('contact')}
                className="p-5 rounded-2xl bg-[#090d14]/90 border border-slate-800 hover:border-red-500/60 hover:shadow-glow-red transition-all text-left group relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-red-400 transition-colors flex items-center justify-between">
                  <span>Get in Touch with Creator</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Creation: fakih • Direct intelligence channel and inquiry dispatch.
                </p>
              </button>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
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

export default ScannerPage;
