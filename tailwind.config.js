/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Audiowide is the STRIKE brand + hero display face (do NOT swap for a generic sans)
        display: ['Audiowide', 'cursive'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Exact background ramp from the source spec
        background: '#050505',
        ink: {
          DEFAULT: '#050505',
          950: '#050505',
          900: '#0a0a0a',
          850: '#0f0f0f',
          800: '#151515',
          700: '#1a1a1a',
          600: '#252525',
        },
        // Retained legacy surface tokens used by the lower sections
        panel: '#0d0d0f',
        card: '#111114',
        // Brand accent (real STRIKE site) — orange #ff7b00 → #f97316
        accent: {
          DEFAULT: '#ff7b00',
          500: '#ff7b00',
          600: '#f97316',
        },
        // Accent gold = rgb(212,160,23) — used by Membership cards + the Boss Fight sale
        gold: '#d4a017',
        goldsoft: '#e8c874',
        // Near-white brand accent used for the active nav dot / gradient CTA
        primary: '#ededf2',
        secondary: '#a1a1aa',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        marquee2: { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        beam: { '0%,100%': { opacity: 0.4 }, '50%': { opacity: 0.7 } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        marquee2: 'marquee2 28s linear infinite',
        blink: 'blink 1s step-end infinite',
        floaty: 'floaty 4s ease-in-out infinite',
        beam: 'beam 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
