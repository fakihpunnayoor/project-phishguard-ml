import React from 'react';
import { Globe, Calendar, Building2, Lock, Unlock, Server, ShieldCheck } from 'lucide-react';

export const WhoisCard = ({ whoisData, tlsData, dnsData, domain, onInspectMore }) => {
  const isHttps = tlsData?.valid || tlsData?.protocol?.includes('TLS');
  const domainAge = whoisData?.domainAgeDays ?? 12;
  const registrar = whoisData?.registrar || 'SuspectReg.com';
  const createdDate = whoisData?.createdDate || '2026-09-01';
  const primaryIp = dnsData?.aRecords?.[0] || dnsData?.ipAddresses?.[0] || '185.220.101.5';

  return (
    <div className="relative rounded-xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-xl p-5 shadow-lg shadow-black/40 overflow-hidden flex flex-col justify-between group hover:border-cyan-400/50 transition-all">
      {/* Decorative cyber corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

      {/* Floating telemetry callout chip matching reference image */}
      <div className="absolute top-3 right-3 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 shadow-glow-cyan">
        <Server className="w-3 h-3 text-cyan-400" />
        <span>IP: {primaryIp}</span>
      </div>

      <div>
        {/* Card Header matching image: WHOIS DATA: */}
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-extrabold tracking-widest uppercase font-mono text-cyan-300">
            WHOIS DATA:
          </h3>
        </div>

        {/* Text Details matching reference image style */}
        <div className="space-y-3 font-mono text-sm">
          <div className="flex items-baseline gap-2">
            <span className="text-slate-400">Domain Age:</span>
            <span className={`font-bold ${domainAge < 30 ? 'text-red-400' : 'text-emerald-400'}`}>
              {domainAge} days;
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-slate-400">Registrar:</span>
            <span className="text-slate-100 font-semibold truncate max-w-[240px]">
              {registrar};
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-slate-400">Created:</span>
            <span className="text-slate-200">
              {createdDate}.
            </span>
          </div>
        </div>

        {/* Additional Floating Chips / Sub-telemetry */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
          {/* TLS State */}
          <div className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800">
            {isHttps ? (
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Unlock className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <div className="truncate">
              <div className="text-[10px] text-slate-500 uppercase">Transport Security</div>
              <div className={`font-bold ${isHttps ? 'text-emerald-400' : 'text-red-400'}`}>
                {tlsData?.protocol || (isHttps ? 'TLSv1.3' : 'Insecure HTTP')}
              </div>
            </div>
          </div>

          {/* Certificate Issuer */}
          <div className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="truncate">
              <div className="text-[10px] text-slate-500 uppercase">Cert Issuer</div>
              <div className="text-slate-300 font-semibold truncate">
                {tlsData?.issuer ? tlsData.issuer.split(' ')[0] : 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/60">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Target: <strong className="text-slate-200 font-normal">{domain}</strong>
        </span>
        {onInspectMore && (
          <button
            onClick={onInspectMore}
            className="text-cyan-400 hover:text-cyan-300 underline text-[11px]"
          >
            Raw WHOIS
          </button>
        )}
      </div>
    </div>
  );
};
