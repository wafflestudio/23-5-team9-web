/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff6f0f',
          hover: '#e65f00',
        },
        secondary: '#ff8c5a',
        accent: '#ffbc42',
        dark: '#212529',
        gray: {
          DEFAULT: '#495057',
          light: '#868e96',
        },
        light: '#f8f9fa',
        white: '#ffffff',
        border: '#e9ecef',
      },
    },
  },
  plugins: [],
}
