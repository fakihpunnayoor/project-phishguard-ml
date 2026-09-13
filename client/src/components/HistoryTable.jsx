import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink, Search, Clock, ArrowUpRight } from 'lucide-react';

export const HistoryTable = ({ history = [], onSelectScan, onInspectBreakdown, compact = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredItems = history.filter(item => {
    const matchesSearch = 
      item.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.domain?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      filterCategory === 'ALL' || item.riskCategory === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const formatTimestamp = (isoDate) => {
    if (!isoDate) return 'Just now';
    try {
      const d = new Date(isoDate);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  const renderBadge = (category) => {
    if (category === 'DANGEROUS') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-950/80 border border-red-500/60 text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
          DANGER
        </span>
      );
    }
    if (category === 'SUSPICIOUS') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950/80 border border-amber-500/60 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          SUSPECT
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/60 text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        SAFE
      </span>
    );
  };

  // Compact version for the 2x2 grid in reference image
  if (compact) {
    return (
      <div className="relative rounded-xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-xl p-5 shadow-lg shadow-black/40 overflow-hidden flex flex-col justify-between group hover:border-cyan-400/50 transition-all">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

        <div>
          {/* Header matching image: SCAN LOGS */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-extrabold tracking-widest uppercase font-mono text-cyan-300">
                SCAN LOGS
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {history.length} Scans Cached
            </span>
          </div>

          {/* List matching reference image: safe-site.org, my-bank.net, verify-bank... */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 font-mono">
            {history.slice(0, 5).map((item, idx) => (
              <div
                key={item._id || idx}
                onClick={() => onSelectScan && onSelectScan(item)}
                className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all hover:bg-slate-900/80 group"
              >
                <div className="truncate min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                    {item.domain || item.url}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {item.url}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-300">
                    {item.threatScore}
                  </span>
                  {renderBadge(item.riskCategory)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="text-[11px] text-slate-500">Live Audit Stream</span>
          <span className="text-cyan-400 hover:text-cyan-300 font-bold">CLICK ROW TO LOAD</span>
        </div>
      </div>
    );
  }

  // Full Expanded Audit Log Data Table (Bottom Section of Dashboard)
  return (
    <div className="relative rounded-xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-xl p-5 sm:p-6 shadow-2xl shadow-black/60 overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold font-mono tracking-wide text-white">
              Real-Time Security Audit Logs & Scan History
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Historical threat classification records persisted across sessions
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search target URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950/80 text-xs font-mono pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400 text-slate-200 placeholder-slate-500 w-48 sm:w-64"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex rounded-lg bg-slate-950/80 border border-slate-800 p-0.5 text-xs font-mono">
            {['ALL', 'DANGEROUS', 'SUSPICIOUS', 'SAFE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Target URL</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Status Badge</th>
              <th className="py-3 px-4">Threat Score</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No matching scan records found in audit store.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectScan && onSelectScan(item)}
                >
                  {/* Target URL */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate max-w-xs sm:max-w-md">
                        {item.url}
                      </span>
                    </div>
                  </td>

                  {/* Scan Timestamp */}
                  <td className="py-3 px-4 text-slate-400">
                    {formatTimestamp(item.scannedAt || item.createdAt)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {renderBadge(item.riskCategory)}
                  </td>

                  {/* Threat Score */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        item.threatScore >= 70 ? 'text-red-400' :
                        item.threatScore >= 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {item.threatScore}/100
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                        <div
                          className={`h-full ${
                            item.threatScore >= 70 ? 'bg-red-500' :
                            item.threatScore >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${item.threatScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectBreakdown && onInspectBreakdown(item);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all font-semibold"
                    >
                      <span>View Full Breakdown</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
