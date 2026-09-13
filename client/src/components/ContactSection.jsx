import React, { useState } from 'react';
import { Mail, User, Send, CheckCircle2, Shield, Copy, Check, MessageSquare, Terminal } from 'lucide-react';

export const ContactSection = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Threat Report / Security Inquiry',
    message: ''
  });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('fakkihpunnayoor@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({
        name: '',
        email: '',
        subject: 'Threat Report / Security Inquiry',
        message: ''
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 relative bg-black border-t border-red-500/10 overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-widest mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Intelligence Channel</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Get In Touch With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-300">
              The Creator.
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Have a question regarding our machine learning phishing classifier, want to report a deceptive zero-day campaign, or discuss security collaborations? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Creator Profile Card (Left 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-[#090d14]/90 border border-red-500/30 shadow-2xl relative">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-950 border border-red-500/50 flex items-center justify-center shadow-glow-red">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                    Creation: fakih
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    PhishGuard AI Creator
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Engineered to bring enterprise-grade neural threat intelligence, lexical heuristic extraction, and sub-second defense to everyday users and security engineers worldwide.
              </p>

              {/* Verified Contact Card */}
              <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-slate-400 uppercase text-[10px] tracking-wider">
                  Direct Inquiries &amp; Security Reports
                </div>
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                  <div className="flex items-center gap-2 truncate text-slate-200">
                    <Mail className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="truncate">fakkihpunnayoor@gmail.com</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="shrink-0 p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Copy email to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Copied fakkihpunnayoor@gmail.com to clipboard</span>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Platform Engine Status: <strong className="text-emerald-400">Operational</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Shield className="w-3.5 h-3.5 text-red-400" />
                  <span>Architecture: Node.js • React • In-Memory Cache • Heuristic ML</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Author: fakih</span>
              <a 
                href="mailto:fakkihpunnayoor@gmail.com"
                className="text-red-400 hover:text-red-300 underline underline-offset-4 font-semibold"
              >
                Send Email →
              </a>
            </div>
          </div>

          {/* Interactive Message Dispatch Form (Right 7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-2xl bg-[#090d14]/90 border border-slate-800 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-500" />
              <span>Send a Direct Dispatch</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-sans">
              Have feedback on detection accuracy or a suspicious link to verify? Dispatch your message below.
            </p>

            {submitted ? (
              <div className="p-8 rounded-xl bg-red-950/20 border border-red-500/40 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Dispatch Transmitted</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you for contacting PhishGuard AI. We will review your message and reply via email at <strong>{formState.email || 'your address'}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Alex Vance"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-white placeholder-slate-600 outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. alex@security.org"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-white placeholder-slate-600 outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                    Subject / Topic
                  </label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-white outline-none transition-all font-sans"
                  >
                    <option value="Threat Report / Security Inquiry">Threat Report / Suspicious Link</option>
                    <option value="False Positive Review">False Positive Review</option>
                    <option value="Machine Learning Partnership">Machine Learning Partnership</option>
                    <option value="General Feedback">General Feedback &amp; Ideas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                    Message Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Describe the target URL, incident telemetry, or question you would like to share..."
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-white placeholder-slate-600 outline-none transition-all font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-sm font-bold tracking-wide shadow-glow-red hover:shadow-glow-red-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message to fakih</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
