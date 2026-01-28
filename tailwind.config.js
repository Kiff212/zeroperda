/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          DEFAULT: '#ef4444', // Red-500 (Restored Industrial Red)
          active: '#fee2e2', // Red-100
          red: '#dc2626', // Red-600
          yellow: '#fbbf24', // Amber-400
          bg: '#09090b', // Zinc-950 (Deep background remain dark)
          surface: '#18181b', // Zinc-900 (Cards remain dark)
        }
      },
      boxShadow: {
        'industrial': '4px 4px 0px 0px #000000',
        'industrial-sm': '2px 2px 0px 0px #000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['monospace'], // Simple mono stack for data
      },
    },
  },
  plugins: [],
}
