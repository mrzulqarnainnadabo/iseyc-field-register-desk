import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Approved institutional design system (ISEYC × TIRNGAN)
        desk: {
          green: "#245B43",
          "green-dark": "#173F30",
          paper: "#F7F8F5",
          ink: "#101C16",
          line: "#D8DED9",
          gold: "#D9B83F",
          black: "#171717",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      minHeight: {
        tap: "48px",
      },
    },
  },
  plugins: [],
};

export default config;
