/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderColor: {
        gray: "#C4C7C5",
        blue: "#1973E8",
        "dark-blue": "#0b57d0",
        "light-gray": "#D5D5D5",
      },
      outlineColor: {
        "light-blue": "#a8c7fa",
      },
      backgroundColor: {
        "dark-silver": "#C0C0C0",
        "light-blue": "#D3E3FD",
      },
      textColor: {
        "light-gray": "#575a5a",
        "dark-gray": "#444746",
      },
      fontFamily: {
        medium: "Open-Sans-Medium",
        bold: "Open-Sans-Bold",
        semibold: "Open-Sans-SemiBold",
        light: "Open-Sans-Light",
        regular: "Open-Sans",
      },
    },
  },
  plugins: [],
};
