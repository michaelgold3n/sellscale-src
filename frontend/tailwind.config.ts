import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          background: "#FFFFFF",
          foreground: "#11181C",
          primary: {
            DEFAULT: "rgb(3, 215, 165)",
            foreground: "#FFFFFF",
          },
        },
      },
      dark: {
        colors: {
          background: "#1a1a1a",
          foreground: "#ECEDEE",
          primary: {
            DEFAULT: "rgb(3, 215, 165)",
            foreground: "#1a1a1a",
          },
        },
      },
    },
  })],
};

export default config;
