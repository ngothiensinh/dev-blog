import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.pink,
        // /profile design tokens — namespaced so Tailwind's cyan/violet/teal scales stay intact
        cv: {
          void: '#0b0e14',
          steel: '#1c2331',
          line: '#3a4a63',
          cyan: '#6fd3ff',
          violet: '#a08cff',
          teal: '#5ee0c4',
          amber: '#ff9f5a',
          ink: '#e6ebf2',
          muted: '#8a95a8',
        },
      },
      fontFamily: {
        display: [
          'var(--font-display)',
          'Arial Narrow',
          'Impact',
          'sans-serif',
        ],
        plex: [
          'var(--font-mono)',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
    },
    typography: ({ theme }) => ({
      DEFAULT: {
        css: {
          a: {
            color: theme('colors.primary.500'),
            '&:hover': {
              color: `${theme('colors.primary.600')}`,
            },
            code: { color: theme('colors.primary.400') },
          },
          'h1,h2': {
            fontWeight: '700',
            letterSpacing: theme('letterSpacing.tight'),
          },
          h3: {
            fontWeight: '600',
          },
          code: {
            color: theme('colors.indigo.500'),
          },
        },
      },
      invert: {
        css: {
          a: {
            color: theme('colors.primary.500'),
            '&:hover': {
              color: `${theme('colors.primary.400')}`,
            },
            code: { color: theme('colors.primary.400') },
          },
          'h1,h2,h3,h4,h5,h6': {
            color: theme('colors.gray.100'),
          },
        },
      },
    }),
  },
  plugins: [require('@tailwindcss/typography')],
};
