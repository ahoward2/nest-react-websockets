/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/client/pages/**/*.{js,ts,jsx,tsx}',
    './src/client/components/**/*.{js,ts,jsx,tsx}',
    './src/client/App.tsx',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      gray: colors.gray,
      blue: colors.sky,
      red: colors.rose,
      cyan: colors.cyan,
      pink: colors.pink,
      purple: colors.purple,
      white: colors.white,
      orange: colors.orange,
      amber: colors.amber,
      black: colors.black,
      rose: colors.rose,
      sky: colors.sky,
      green: colors.green,
      teal: colors.teal,
      emerald: colors.emerald,
      slate: colors.slate,
      zinc: colors.zinc,
      stone: colors.stone,
      violet: colors.violet,
      lime: colors.lime,
      indigo: colors.indigo,
      yellow: colors.yellow,
      fuchsia: colors.fuchsia,
      transparent: colors.transparent,
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    extend: {
      spacing: {
        127: '31rem',
        128: '32rem',
        144: '36rem',
        575: '575px',
        576: '576px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
