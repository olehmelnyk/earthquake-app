const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  presets: [require('../../packages/ui/tailwind.config.js')],
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
