/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#070a12',
          subtle: '#0c111d',
        },
        surface: {
          DEFAULT: '#111726',
          raised: '#172033',
          border: '#1e293f',
          hover: '#1d273f',
        },
        sports: {
          red: {
            DEFAULT: '#ff2d4a',
            dark: '#dc2626',
            light: '#ff546c',
            glow: 'rgba(255, 45, 74, 0.4)',
          },
          blue: {
            DEFAULT: '#00d2ff',
            dark: '#0284c7',
            light: '#38bdf8',
            glow: 'rgba(0, 210, 255, 0.3)',
          },
          green: {
            DEFAULT: '#10b981',
            dark: '#059669',
            light: '#34d399',
          },
          amber: {
            DEFAULT: '#f59e0b',
            dark: '#d97706',
          }
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        display: [
          'Teko',
          'Oswald',
          'Inter',
          'sans-serif'
        ]
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(255, 45, 74, 0.35)',
        'glow-blue': '0 0 20px rgba(0, 210, 255, 0.25)',
        'card-hover': '0 12px 30px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 45, 74, 0.15)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
