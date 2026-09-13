/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#05070a',
          slate: '#0a0d14',
          card: '#0c0f18',
          surface: '#111422',
          border: 'rgba(255, 42, 42, 0.2)',
          red: '#ff2a2a',
          neonRed: '#ff1e38',
          cyan: '#00f2fe',
          blue: '#3b82f6',
          amber: '#f59e0b',
          crimson: '#ff2a5f',
          danger: '#ef4444',
          safe: '#10b981'
        }
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(255, 42, 42, 0.65)',
        'glow-red-lg': '0 0 45px rgba(255, 42, 42, 0.85)',
        'glow-red-sm': '0 0 15px rgba(255, 42, 42, 0.45)',
        'glow-cyan': '0 0 20px rgba(0, 242, 254, 0.35)',
        'glow-danger': '0 0 25px rgba(255, 42, 95, 0.55)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.45)',
        'glow-safe': '0 0 20px rgba(16, 185, 129, 0.4)'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
};
