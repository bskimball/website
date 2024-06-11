const { nextui } = require('@nextui-org/theme')
// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['var(--font-lato)', ...fontFamily.sans],
      },
      // colors: {
      //   primary: colors.cyan,
      //   gray: colors.slate,
      // },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.cyan.500'),
              '&:hover': {
                color: `${theme('colors.cyan.600')}`,
              },
              code: { color: theme('colors.cyan.400') },
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
              color: theme('colors.cyan.500'),
              '&:hover': {
                color: `${theme('colors.cyan.400')}`,
              },
              code: { color: theme('colors.cyan.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.slate.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-hero-patterns'),
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              ...colors.cyan,
              DEFAULT: colors.cyan['500'],
              foreground: colors.cyan['50'],
            },
          },
        },
        light: {
          colors: {
            primary: {
              ...colors.cyan,
              DEFAULT: colors.cyan['500'],
              foreground: colors.cyan['50'],
            },
          },
        },
      },
    }),
  ],
}
