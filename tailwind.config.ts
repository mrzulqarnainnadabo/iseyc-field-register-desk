import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Restrained institutional palette — deep green + navy + one warm accent.
        desk: {
          green: "#0E3B2E",
          "green-dark": "#082720",
          navy: "#0B1F33",
          paper: "#F7F6F2",
          ink: "#141414",
          line: "#E3E0D8",
          accent: "#B08A3E",
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
    },
  },
  plugins: [],
};

export default config;
