module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Ensure all your components are scanned
  ],
  theme: {
    extend: {
      animation: {
        'hero-moveVertical': 'moveVertical 30s ease infinite',
        'hero-moveInCircle': 'moveInCircle 20s reverse infinite',
        'hero-moveInCircleSlow': 'moveInCircle 40s linear infinite',
        'hero-moveHorizontal': 'moveHorizontal 40s ease infinite',
      },
      keyframes: {
        moveHorizontal: {
          '0%': { transform: 'translateX(-50%) translateY(-10%)' },
          '50%': { transform: 'translateX(50%) translateY(10%)' },
          '100%': { transform: 'translateX(-50%) translateY(-10%)' },
        },
        moveInCircle: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        moveVertical: {
          '0%': { transform: 'translateY(-50%)' },
          '50%': { transform: 'translateY(50%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
    },
  },
  plugins: [],
};