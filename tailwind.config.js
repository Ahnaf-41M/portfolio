/** @type {import('tailwindcss').Config} */
export default {
  content: ['./static/**/*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // One accent, two shades. `accent` reads well on light backgrounds,
        // `accent-bright` on the near-black dark background. Change these two
        // values to re-skin the whole site.
        accent: {
          DEFAULT: '#0d9488', // teal-600
          bright: '#2dd4bf', // teal-400
        },
      },
      fontFamily: {
        // Body stays on the system stack (no web-font request for reading text).
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        // Loaded from Google Fonts in <head>.
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      maxWidth: {
        content: '46rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        blink: 'blink 1.15s step-end infinite',
      },
    },
  },
  plugins: [],
};
