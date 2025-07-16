/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D1117', // Main background
        surface: '#161B22',   // Card background
        primary: '#58a6ff',   // Primary interactive color
        subtle: '#8b949e',     // Secondary text and borders
        highlight: 'rgba(88, 166, 255, 0.1)', // For button hovers, etc.
      },
      keyframes: {
        'flowing-border': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'flowing-border': 'flowing-border 3s linear infinite',
        blink: 'blink 1s steps(2, start) infinite',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.200'),
            h1: { color: theme('colors.blue.100'), fontWeight: '800', borderBottom: `2px solid ${theme('colors.slate.700')}`, paddingBottom: '0.3em', marginBottom: '0.7em' },
            h2: { color: theme('colors.blue.200'), fontWeight: '800', borderBottom: `1.5px solid ${theme('colors.slate.700')}`, paddingBottom: '0.2em', marginBottom: '0.6em' },
            h3: { color: theme('colors.blue.300'), fontWeight: '700', marginTop: '1.2em', marginBottom: '0.5em' },
            p: { color: theme('colors.slate.200'), fontSize: '1.05rem', lineHeight: '1.7', marginTop: '0.7em', marginBottom: '0.7em' },
            ul: { marginTop: '0.5em', marginBottom: '0.5em', paddingLeft: '1.5em' },
            ol: { marginTop: '0.5em', marginBottom: '0.5em', paddingLeft: '1.5em' },
            li: { color: theme('colors.slate.300'), fontSize: '1.05rem', lineHeight: '1.7', marginTop: '0.2em', marginBottom: '0.2em' },
            'ul > li::marker': { color: theme('colors.blue.400'), fontWeight: '700' },
            'ol > li::marker': { color: theme('colors.pink.400'), fontWeight: '700' },
            strong: { color: theme('colors.blue.200'), fontWeight: '700' },
            a: { color: theme('colors.blue.400'), textDecoration: 'underline', fontWeight: '500' },
            blockquote: { color: theme('colors.blue.200'), fontStyle: 'italic', borderLeftColor: theme('colors.blue.500'), backgroundColor: theme('colors.slate.800'), paddingLeft: '1.2em', paddingTop: '0.5em', paddingBottom: '0.5em', borderRadius: '0.5em', marginTop: '1em', marginBottom: '1em' },
            code: { color: theme('colors.pink.300'), backgroundColor: theme('colors.slate.800'), padding: '0.2em 0.4em', borderRadius: '0.3em', fontSize: '0.95em' },
            hr: { borderColor: theme('colors.slate.700'), marginTop: '1.5em', marginBottom: '1.5em' },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};
