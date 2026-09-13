import React, { useState } from 'react';
import { Link2, FileText, FolderLock, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const ScannerCard = ({ onScan, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState('url');
  const [inputUrl, setInputUrl] = useState('http://verify-bank.com/secure/login');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setValidationError('Please enter a website URL to scan.');
      return;
    }

    onScan(trimmed);
  };

  const handlePreset = (url) => {
    setInputUrl(url);
    setValidationError('');
    onScan(url);
  };

  return (
    <div id="scanner" className="relative max-w-4xl mx-auto px-4 sm:px-6 my-10">
      {/* Background Volumetric Red Ambient Aura */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600/20 via-red-500/30 to-red-600/20 rounded-2xl blur-xl opacity-75 pointer-events-none" />

      {/* Main Glassmorphic Scanner Card matching Reference Image 1 */}
      <div className="relative rounded-2xl bg-black/85 border border-red-500/35 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,42,42,0.18)]">
        
        {/* Navigation Tabs matching Reference Image 1 */}
        <div className="flex items-center justify-center sm:justify-start gap-6 pb-6 border-b border-white/10 text-xs sm:text-sm font-sans font-medium">
          {/* Tab 1: Scan URL (Active) */}
          <button
            onClick={() => setActiveTab('url')}
            className={`relative flex items-center gap-2 pb-2 transition-colors ${
              activeTab === 'url' ? 'text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link2 className="w-4 h-4 text-red-500" />
            <span>Scan URL</span>
            {activeTab === 'url' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(255,42,42,0.9)]" />
            )}
          </button>

          {/* Tab 2: Analyze Text */}
          <button
            onClick={() => setActiveTab('text')}
            className={`relative flex items-center gap-2 pb-2 transition-colors ${
              activeTab === 'text' ? 'text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Analyze Text</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 hidden sm:inline">
              Planned
            </span>
            {activeTab === 'text' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Tab 3: Check File */}
          <button
            onClick={() => setActiveTab('file')}
            className={`relative flex items-center gap-2 pb-2 transition-colors ${
              activeTab === 'file' ? 'text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderLock className="w-4 h-4 text-slate-500" />
            <span>Check File</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 hidden sm:inline">
              Planned
            </span>
            {activeTab === 'file' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1 Content: Live Machine Learning URL Scanner */}
        {activeTab === 'url' && (
          <div className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative flex flex-col sm:flex-row items-center gap-3">
                {/* Input Bar */}
                <div className="relative flex-1 w-full flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <Link2 className="w-5 h-5 text-red-500" />
                  </div>
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder="Enter a website URL (e.g. https://example.com)"
                    className="w-full bg-[#0a0d14]/90 text-white placeholder-slate-500 text-sm sm:text-base font-sans pl-12 pr-4 py-3.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-red-500 focus:shadow-glow-red transition-all"
                  />
                </div>

                {/* Scan Now Button matching Reference Image 1 */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-600 text-white font-mono text-sm font-bold tracking-wider uppercase transition-all shadow-glow-red hover:shadow-glow-red-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 min-w-[150px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <span>Scan Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Validation or API Error Display */}
              {(validationError || error) && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/60 border border-red-500/60 text-xs font-mono text-red-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{validationError || error}</span>
                </div>
              )}

              {/* Supporting text matching Reference Image 1 */}
              <p className="text-center text-xs sm:text-sm text-slate-400 font-sans pt-1">
                Our AI will analyze the URL and detect if it's safe or a phishing threat.
              </p>

              {/* Quick Presets for Demo */}
              <div className="flex items-center justify-center flex-wrap gap-2 pt-2 text-xs font-mono">
                <span className="text-slate-500">Quick Test Presets:</span>
                <button
                  type="button"
                  onClick={() => handlePreset('http://verify-bank.com/secure/login')}
                  className="px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-600/40 transition-colors"
                >
                  verify-bank.com (Phishing Demo)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('http://192.168.1.105:8080/update-credential.php')}
                  className="px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-600/40 transition-colors"
                >
                  Suspicious IP Host
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('https://github.com')}
                  className="px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 transition-colors"
                >
                  github.com (Verified Safe)
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2 & 3 Notice */}
        {activeTab !== 'url' && (
          <div className="py-12 text-center font-sans space-y-2">
            <div className="text-white font-bold text-base">Feature in Model Training Pipeline</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              NLP text sentiment analysis and heuristic file attachment scanning are scheduled for PhishGuard AI v2.5 release. Use <strong>Scan URL</strong> for real-time live threat extraction.
            </p>
            <button
              onClick={() => setActiveTab('url')}
              className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-mono font-bold"
            >
              Switch to Live URL Scanner
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ScannerCard;
