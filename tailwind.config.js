/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        'primary-hover': '#0052CC',
        'primary-light': '#E8F4FF',
        'bg-bot': '#F5F5F5',
        'text-primary': '#1a1a1a',
        'text-secondary': '#666666',
        'border-color': '#e0e0e0',
      },
    },
  },
  plugins: [],
}