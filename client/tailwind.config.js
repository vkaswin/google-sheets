/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mild-blue": "#d3e3fd",
        "medium-light-blue": "#1973e8",
        "dark-blue": "#0b57d0",
        "light-silver": "#F9FBFD",
        "light-gray": "#E8EBEE",
        "light-blue": "#EDF2FA",
        "mild-silver": "#e8eaed",
      },
      textColor: {
        "light-gray": "#575a5a",
        "dark-gray": "#444746",
      },
      fontFamily: {
        medium: "Open-Sans-Medium",
        bold: "Open-Sans-Bold",
        "semi-bold": "Open-Sans-SemiBold",
        light: "Open-Sans-Light",
        regular: "Open-Sans",
      },
    },
  },
  plugins: [],
};
