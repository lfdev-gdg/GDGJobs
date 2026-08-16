import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gdg: {
          blue: '#1D4ED8',
          red: '#EA4335',
          yellow: '#F9AB00',
          green: '#34A853',
          dark: '#111827',
          light: '#F9FAFB',
          border: '#E5E7EB',
          muted: '#6B7280',
        },
      },
      boxShadow: {
        soft: '0 12px 30px rgba(17, 24, 39, 0.08)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
