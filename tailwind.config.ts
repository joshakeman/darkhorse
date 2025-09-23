import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        serif: ['var(--font-serif)'], // <— our accent font
      },
      // (optional) tiny letter-spacing tighten for luxe feel:
      letterSpacing: {
        tightish: '-0.01em',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            // Make rich text headings use the serif
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.serif').join(','),
              letterSpacing: theme('letterSpacing.tightish'),
            },
            blockquote: {
              fontFamily: theme('fontFamily.serif').join(','),
              fontStyle: 'normal',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
}
