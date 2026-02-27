/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#ed1b2f',
          'primary-content': '#ffffff',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#ed1b2f',
          'primary-content': '#ffffff',
        },
      },
    ],
  },
};
