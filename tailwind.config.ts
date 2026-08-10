import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0e0d12',
        panel: '#13111a',
        accentGlow: '#2255FF',
        neonPurple: '#b44dff',
        textMuted: '#8E919E',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(34, 85, 255, 0.2)',
        'glow-blue-lg': '0 0 40px rgba(34, 85, 255, 0.3)',
        'glow-sm': '0 0 10px rgba(34, 85, 255, 0.15)',
        'glow-purple': '0 0 0 1px rgba(180, 77, 255, 0.5), 0 0 20px rgba(180, 77, 255, 0.4), 0 0 50px rgba(180, 77, 255, 0.15)',
        'glow-purple-lg': '0 0 0 1px rgba(180, 77, 255, 0.6), 0 0 30px rgba(180, 77, 255, 0.5), 0 0 70px rgba(180, 77, 255, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(34, 85, 255, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(34, 85, 255, 0.45)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
