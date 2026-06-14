/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(15,23,42,0.45)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 35%), linear-gradient(180deg, rgba(15,23,42,1), rgba(2,6,23,1))',
      },
    },
  },
  plugins: [],
};
