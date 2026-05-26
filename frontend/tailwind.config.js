/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1d4ed8',
          700: '#1e3a8a',
          800: '#1e2d6b',
          900: '#0f172a',
          950: '#060d1f',
        },
        silver: {
          100: '#f8fafc',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
        }
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #060d1f 0%, #0f172a 30%, #1e2d6b 70%, #1d4ed8 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'glow-blue': 'radial-gradient(ellipse at center, rgba(29,78,216,0.3) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'particle': 'particle 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(29,78,216,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(29,78,216,0.8), 0 0 80px rgba(29,78,216,0.3)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) translateX(100px) rotate(360deg)', opacity: '0' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'royal': '0 0 30px rgba(29,78,216,0.3)',
        'royal-lg': '0 0 60px rgba(29,78,216,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
