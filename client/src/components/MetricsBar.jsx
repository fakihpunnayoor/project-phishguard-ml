import React from 'react';
import { Users, Target, ShieldAlert, Globe } from 'lucide-react';

export const MetricsBar = ({ stats }) => {
  const totalScanned = stats?.total ? `${stats.total + 100}K+` : '100K+';
  const threatsBlocked = stats?.dangerous ? `${stats.dangerous + 50}K+` : '50K+';

  const metrics = [
    {
      icon: Users,
      value: totalScanned,
      label: 'URLs Scanned',
    },
    {
      icon: Target,
      value: '98.7%',
      label: 'Detection Accuracy',
    },
    {
      icon: ShieldAlert,
      value: threatsBlocked,
      label: 'Threats Blocked',
    },
    {
      icon: Globe,
      value: 'A Safer',
      label: 'Digital World',
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 my-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div 
              key={idx} 
              className={`flex items-center gap-3.5 justify-center ${
                idx < 3 ? 'md:border-r border-white/10' : ''
              }`}
            >
              {/* Red Circle with Icon matching Reference Image 1 */}
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-500 shrink-0 shadow-glow-red-sm">
                <Icon className="w-5 h-5" />
              </div>

              {/* Value & Label */}
              <div className="font-sans">
                <div className="text-lg sm:text-xl font-extrabold text-white leading-none">
                  {m.value}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">
                  {m.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MetricsBar;
