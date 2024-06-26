// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  // Remove the darkMode property as it's no longer necessary in v3
  theme: {
    extend: {
      colors: {
        'scriptforge-blue': '#2a3e52', // Custom color for the main background
        'button-blue': '#1d4ed8', // blue-600
        'button-blue-hover': '#2563eb', // blue-700
        'button-gray': '#4b5563', // gray-600
        'button-gray-hover': '#6b7280', // gray-700
        'dark-blue': '#0F0F28',
        'almost-black': '#050506',
        'off-white' : '#f1f1f1',
        'accent' : '#FFA32C',
        'custom-dark': '#0b0b1f',

      },
    },
  },
  plugins: [],
};
