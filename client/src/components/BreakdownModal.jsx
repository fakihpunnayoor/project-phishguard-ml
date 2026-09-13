import React, { useState } from 'react';
import { X, Globe, ShieldAlert, Lock, Server, FileText, Code, CheckCircle, AlertTriangle } from 'lucide-react';

export const BreakdownModal = ({ isOpen, onClose, scanData }) => {
  const [activeTab, setActiveTab] = useState('indicators');

  if (!isOpen || !scanData) return null;

  const {
    url,
    domain,
    threatScore,
    riskCategory,
    lexicalScore,
    contentScore,
    networkScore,
    triggeredIndicators = [],
    whoisData = {},
    tlsData = {},
    dnsData = {},
    contentData = {},
    scannedAt,
    scanDurationMs
  } = scanData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-950/95 border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/50 font-mono text-xs max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                riskCategory === 'DANGEROUS' ? 'bg-red-900/80 text-red-200 border border-red-500' :
                riskCategory === 'SUSPICIOUS' ? 'bg-amber-900/80 text-amber-200 border border-amber-500' :
                'bg-emerald-900/80 text-emerald-200 border border-emerald-500'
              }`}>
                {riskCategory} ({threatScore}/100)
              </span>
              <span className="text-slate-400 text-xs">
                Scan Latency: {scanDurationMs}ms
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-xl">
              {url}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 py-3 border-b border-slate-800/80 shrink-0">
          {[
            { id: 'indicators', label: `Indicators (${triggeredIndicators.length})` },
            { id: 'network', label: 'DNS & TLS' },
            { id: 'whois', label: 'WHOIS / Domain' },
            { id: 'content', label: 'DOM Content' },
            { id: 'raw', label: 'Raw JSON Payload' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* 1. Indicators Tab */}
          {activeTab === 'indicators' && (
            <div className="space-y-2.5">
              {triggeredIndicators.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No threat indicators triggered. Domain is categorized as SAFE.
                </div>
              ) : (
                triggeredIndicators.map((ind, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-200">{ind.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ind.severity === 'CRITICAL' ? 'bg-red-900/80 text-red-200 border border-red-500' :
                        ind.severity === 'HIGH' ? 'bg-amber-900/80 text-amber-200 border border-amber-500' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {ind.severity} (+{ind.scorePenalty || 0} pts)
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-xs">{ind.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. Network & TLS Tab */}
          {activeTab === 'network' && (
            <div className="space-y-4">
              {/* TLS Data */}
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  TLS / SSL Certificate Audit
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500">Status: </span>
                    <span className={tlsData.valid ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {tlsData.valid ? 'Valid & Authorized' : 'Invalid / Insecure'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Protocol: </span>
                    <span className="text-slate-200 font-bold">{tlsData.protocol || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Issuer: </span>
                    <span className="text-slate-200">{tlsData.issuer || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Subject: </span>
                    <span className="text-slate-200">{tlsData.subject || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Valid To: </span>
                    <span className="text-slate-200">{tlsData.validTo || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Days Remaining: </span>
                    <span className="text-cyan-400 font-bold">{tlsData.daysRemaining ?? 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* DNS Data */}
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  DNS Infrastructure Records
                </h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-slate-400 font-semibold mb-1">A Records (IPv4):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(dnsData.aRecords || []).length > 0 ? (
                        dnsData.aRecords.map((ip, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-200">
                            {ip}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500">No A records resolved</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-slate-400 font-semibold mb-1">Nameservers (NS):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(dnsData.nsRecords || []).length > 0 ? (
                        dnsData.nsRecords.map((ns, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-300">
                            {ns}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500">None detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. WHOIS Tab */}
          {activeTab === 'whois' && (
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Domain Registration & WHOIS Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">Registrar: </span>
                  <span className="text-slate-200 font-bold">{whoisData.registrar || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Domain Age: </span>
                  <span className="text-cyan-400 font-bold">{whoisData.domainAgeDays || 0} days</span>
                </div>
                <div>
                  <span className="text-slate-500">Registration Date: </span>
                  <span className="text-slate-200">{whoisData.createdDate || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Expiration Date: </span>
                  <span className="text-slate-200">{whoisData.expiresDate || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Content DOM Tab */}
          {activeTab === 'content' && (
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                DOM & Page Content Audit
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-500">Page Title: </span>
                  <span className="text-slate-200 font-semibold">{contentData.pageTitle || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500">HTTP Status Code: </span>
                  <span className="text-slate-200">{contentData.statusCode || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Password Input Present: </span>
                  <span className={contentData.hasPasswordInput ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {contentData.hasPasswordInput ? 'YES' : 'NO'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">External Form Action: </span>
                  <span className={contentData.hasExternalFormAction ? 'text-red-400 font-bold' : 'text-slate-400'}>
                    {contentData.hasExternalFormAction ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Raw JSON Tab */}
          {activeTab === 'raw' && (
            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(scanData, null, 2)}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
