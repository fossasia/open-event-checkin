/** @type {import('tailwindcss').Config} */

import tailwindForms from '@tailwindcss/forms'
import colors from 'tailwindcss/colors'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Ubuntu', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['"Fira Code"', 'monospace'],
    },
    colors: {
      // background, borders, text
      body: {
        light: colors.neutral[200],
        DEFAULT: colors.neutral[900],
        dark: colors.neutral[950],
      },
      // hyperlinks, focus styles, active states
      primary: {
        light: colors.blue[300],
        DEFAULT: colors.blue[600],
        dark: colors.blue[700],
      },
      // dividers, disabled states, placeholder text
      secondary: {
        light: colors.gray[200],
        DEFAULT: colors.gray[400],
        dark: colors.gray[800],
      },
      success: {
        light: colors.green[400],
        DEFAULT: colors.green[600],
        dark: colors.green[800],
      },
      danger: {
        light: colors.red[100],
        DEFAULT: colors.red[600],
        dark: colors.red[800],
      },
      warning: {
        light: colors.yellow[200],
        DEFAULT: colors.yellow[300],
        dark: colors.yellow[400],
      },
      info: {
        light: colors.indigo[200],
        DEFAULT: colors.indigo[500],
        dark: colors.indigo[700],
      },
      white: colors.white,
      black: colors.black,
    extend: {
      },
    },
  },
  plugins: [
    tailwindForms
  ]
}