import React, { useState, useEffect } from 'react';
import { UrlBar } from './UrlBar';
import { WhoisCard } from './WhoisCard';
import { RiskCard } from './RiskCard';
import { ScoringCard } from './ScoringCard';
import { HistoryTable } from './HistoryTable';
import { BreakdownModal } from './BreakdownModal';
import { PipelineModal } from './PipelineModal';
import { scanUrl, getScanHistory, getScanStats, getSystemHealth } from '../services/api';
import { Shield, ShieldAlert, Cpu, Activity, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';

export const Dashboard = ({ isPipelineOpen, setIsPipelineOpen }) => {
  // Baseline initial state exactly matching the reference layout image
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
  const [selectedScanForModal, setSelectedScanForModal] = useState(null);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  // Load initial history and stats from server
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
      console.warn('Initial data load warning:', err.message);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  // Handle URL scanning submission
  const handleScan = async (targetUrl) => {
    setIsLoading(true);
    setErrorToast(null);

    try {
      const response = await scanUrl(targetUrl);
      if (response.success && response.data) {
        // Update current scan state
        const enriched = {
          ...response.data,
          cached: response.cached,
          cacheSource: response.cacheSource,
          scanDurationMs: response.scanDurationMs
        };
        setCurrentResult(enriched);

        // Prepend to history list if new
        setHistory((prev) => {
          const exists = prev.some((h) => h._id === enriched._id);
          return exists ? prev : [enriched, ...prev];
        });

        // Refresh stats
        loadPlatformData();
      } else {
        setErrorToast(response.message || 'Scan failed to complete');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error communicating with scan engine';
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
    <main className="w-full min-h-screen bg-[#070b12] text-slate-100 cyber-grid-bg pb-16">
      {/* Error Toast */}
      {errorToast && (
        <div className="fixed top-20 right-4 z-50 max-w-md p-4 rounded-xl bg-red-950/90 border border-red-500 text-red-200 shadow-2xl flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-right font-mono text-xs">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-red-300">Scan Warning</div>
            <div className="mt-0.5">{errorToast}</div>
          </div>
          <button
            onClick={() => setErrorToast(null)}
            className="text-red-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header & Live URL Inspection Bar */}
      <UrlBar
        onScan={handleScan}
        currentResult={currentResult}
        isLoading={isLoading}
      />

      {/* 2. Telemetry & Analytics Grid (Faithfully replicating the 4-quadrant layout in reference image) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Domain & WHOIS Intelligence (Top-Left in reference image) */}
          <WhoisCard
            whoisData={currentResult?.whoisData}
            tlsData={currentResult?.tlsData}
            dnsData={currentResult?.dnsData}
            domain={currentResult?.domain || 'verify-bank.com'}
            onInspectMore={() => handleOpenBreakdown(currentResult)}
          />

          {/* Card 2: Triggered Threat Indicators (Top-Right in reference image) */}
          <RiskCard
            indicators={currentResult?.triggeredIndicators}
            riskCategory={currentResult?.riskCategory || 'DANGEROUS'}
          />

          {/* Card 3: Model Scoring Breakdown (Bottom-Left in reference image) */}
          <ScoringCard
            lexicalScore={currentResult?.lexicalScore ?? 85}
            contentScore={currentResult?.contentScore ?? 95}
            threatScore={currentResult?.threatScore ?? 92}
          />

          {/* Card 4: Real-time Scan Logs (Bottom-Right in reference image) */}
          <HistoryTable
            history={history}
            onSelectScan={handleSelectFromHistory}
            compact={true}
          />
        </div>
      </section>

      {/* 3. Comprehensive Audit Log Data Table (Bottom Section replacing any old portfolio/contact section) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        <HistoryTable
          history={history}
          onSelectScan={handleSelectFromHistory}
          onInspectBreakdown={handleOpenBreakdown}
          compact={false}
        />
      </section>

      {/* Forensic Deep Scan Modal */}
      <BreakdownModal
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        scanData={selectedScanForModal}
      />

      {/* System Architecture Pipeline Visualizer Modal */}
      <PipelineModal
        isOpen={isPipelineOpen}
        onClose={() => setIsPipelineOpen(false)}
        isCached={currentResult?.cached}
      />
    </main>
  );
};

export default Dashboard;
