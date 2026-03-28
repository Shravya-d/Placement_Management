/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#0D0D0F',
        deep: '#1A1A2E',
        midnight: '#16213E',
        ink: '#0F3460',
        surface: '#1E1F35',
        light: '#F8F9FF',
        'brand-violet': '#7B5CF0',
        'brand-iris': '#533AB7',
        'brand-lavender': '#A78BFA',
        'brand-mist': '#EDE9FE',
        'accent-teal': '#00D4AA',
        'accent-cyan': '#06B6D4',
        'accent-gold': '#F59E0B',
        'accent-red': '#E11D48',
        'neutral-900': '#0D0D1A',
        'neutral-700': '#343550',
        'neutral-500': '#5E6080',
        'neutral-300': '#9496B4',
        'neutral-100': '#C8CAE0',
        'neutral-50': '#E8E9F5',
        'neutral-0': '#F8F9FF',
      },
      fontFamily: {

        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],

      },
    },
  },
  plugins: [],
}
