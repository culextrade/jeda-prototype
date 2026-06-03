/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          DEFAULT: '#1F6F65',
          dark: '#16544C',
          tint: '#E7F1EF',
        },
        amber: {
          DEFAULT: '#E39A2E',
          tint: '#FCF3E3',
        },
        clay: {
          DEFAULT: '#CF6F55',
          tint: '#F8EAE4',
        },
        ink: {
          DEFAULT: '#1C2B29',
          soft: '#52635F',
        },
        line: '#DCE5E2',
        canvas: '#F7FAF9',
        surface: '#FFFFFF',
        success: '#3E8E5A',
        warn: '#C9842B',
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '24px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 43, 41, 0.06), 0 4px 16px rgba(28, 43, 41, 0.05)',
      },
    },
  },
  plugins: [],
}
