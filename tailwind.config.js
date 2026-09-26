/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          forest: '#0c4236',
          emerald: '#0f5144',
          'emerald-dark': '#0f5144',
          teal: '#116957',
          mint: '#e6f4f1',
          'soft-mint': '#f0f9f7',
          accent: '#22c55e',
          slateNavy: '#0f172a',
          sand: '#fbfbf8',
          // Dark mode brand colors
          'dark-forest': '#003731',
          'dark-emerald': '#2dd4bf',
          'dark-teal': '#57f1db',
          'dark-mint': 'rgba(45, 212, 191, 0.12)',
          'dark-soft-mint': 'rgba(45, 212, 191, 0.05)',
          'dark-accent': '#4edea3',
        },
        surface: {
          base: '#0c1312',
          dim: '#0e1514',
          card: '#131c1a',
          container: '#182422',
          border: '#203330',
          'border-light': 'rgba(45, 212, 191, 0.18)'
        },
        psp: {
          cyan: '#2dd4bf',
          'cyan-hover': '#14b8a6',
          'cyan-subtle': 'rgba(45, 212, 191, 0.15)',
          teal: '#0f5144',
          'teal-dark': '#0c4236',
          orange: '#f97316',
          green: '#10b981',
          dark: '#0c1312',
          'dark-card': '#131c1a',
          'dark-surface': '#182422',
          light: '#F8FAFA',
          'light-card': '#FFFFFF',
          'light-surface': '#f0f9f7',
        }
      },
      boxShadow: {
        'psp-card': '0 8px 32px rgba(15, 81, 68, 0.08)',
        'psp-dark': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'psp-soft': '0 2px 12px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
