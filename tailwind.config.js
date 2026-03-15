/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // DealZoda Brand Colors
        purple: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8', // Brand primary
          900: '#581c87',
          950: '#3b0764',
        },
        navy: {
          DEFAULT: '#1E1B4B',
          dark:    '#0F0E2A',
          deeper:  '#08071A',
          light:   '#312E81',
        },
        yellow: {
          DEFAULT: '#F59E0B', // Brand accent
          light:   '#FCD34D',
          dark:    '#D97706',
        },
        lavender: '#EDE9FE',
        // Deal score colors
        score: {
          excellent: '#10B981', // 90-100
          good:      '#3B82F6', // 70-89
          ok:        '#F59E0B', // 50-69
          poor:      '#EF4444', // below 50
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'slide-up':     'slideUp 0.6s ease-out forwards',
        'fade-in':      'fadeIn 0.8s ease-out forwards',
        'scan-line':    'scanLine 2s linear infinite',
        'count-score':  'countScore 2s ease-out 0.5s forwards',
        'shimmer':      'shimmer 2.5s linear infinite',
        'bounce-x':     'bounceX 1.5s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' },
          '50%':      { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.3)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%':      { transform: 'translateX(6px)' },
        },
      },
      backgroundImage: {
        'dot-grid':         'radial-gradient(circle, rgba(139,92,246,0.15) 1px, transparent 1px)',
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glow-purple':      'radial-gradient(ellipse at center, rgba(109,33,168,0.35) 0%, transparent 70%)',
        'glow-yellow':      'radial-gradient(ellipse at center, rgba(245,158,11,0.2) 0%, transparent 70%)',
        'card-shimmer':     'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
      },
      backgroundSize: {
        'dot-grid': '28px 28px',
        'shimmer':  '200% 100%',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(109, 33, 168, 0.5)',
        'glow-yellow': '0 0 30px rgba(245, 158, 11, 0.4)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'card-hover':  '0 8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
