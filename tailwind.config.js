/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'sans-serif'], // 기본 sans 폰트 설정
        serif: ['Georgia', 'serif'], // 기본 serif 폰트 설정
        mono: ['Courier New', 'monospace'], // 기본 mono 폰트 설정
      },
    },
  },
  plugins: [],
};
