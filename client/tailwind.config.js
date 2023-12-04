/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderColor: {
        gray: "#C4C7C5",
        "dark-gray": "#747775",
        blue: "#1973E8",
        "dark-blue": "#0b57d0",
        "light-gray": "#D5D5D5",
        "mild-gray": "#d9d9d9",
        "light-silver": "#e1e3e1",
        "light-green": "#4eac6e",
      },
      outlineColor: {
        "light-blue": "#a8c7fa",
        "dark-blue": "#0b57d0",
        "dark-gray": "#747775",
      },
      backgroundColor: {
        "mild-gray": "#E1E1E1",
        "dark-silver": "#C0C0C0",
        "dark-blue": "#0b57d0",
        "light-blue": "#D3E3FD",
        blue: "#4589eb",
        "light-green": "#C7EED1",
        "dark-green": "#79D28F",
        "sky-blue": "#e1e9f7",
        "light-sky-blue": "rgb(14, 101, 235, 0.1)",
        "mild-blue": "#EDF2FA",
        "light-silver": "#f9fbfd",
        "light-gray": "#BEC1C6",
      },
      textColor: {
        "light-gray": "#575a5a",
        "dark-gray": "#444746",
        "mild-black": "#202124",
        "light-green": "#4eac6e",
        "dark-blue": "#0b57d0",
      },
      fontFamily: {
        medium: "Open Sans Medium",
        bold: "Open Sans Bold",
        semibold: "Open Sans SemiBold",
        light: "Open Sans Light",
        regular: "Open Sans",
      },
    },
  },
  plugins: [],
};
