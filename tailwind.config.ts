import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#EAE0C6",
          light: "#F4EEDC",
          dark: "#DCCFA8",
        },
        walnut: {
          DEFAULT: "#3E2A1E",
          light: "#5A3E2B",
          dark: "#2A1C13",
        },
        oxblood: {
          DEFAULT: "#7A2E2A",
          light: "#93413C",
          dark: "#5C211E",
        },
        // Accessible red accent for text/links/borders on dark wood backgrounds.
        // Oxblood itself is too close in luminance to walnut to read as text
        // (contrast ~1.1:1), so use `ember` anywhere red needs to be *read*,
        // and keep `oxblood` for solid fills paired with light text.
        ember: {
          DEFAULT: "#EAA398",
          light: "#F2BFB6",
          dark: "#D9806F",
        },
        brass: {
          DEFAULT: "#B8923F",
          light: "#D4B36A",
          dark: "#8F701F",
        },
        forest: {
          DEFAULT: "#3F4A35",
          light: "#57654A",
        },
        ink: "#2B241C",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
      },
      boxShadow: {
        spine: "2px 2px 6px rgba(43, 36, 28, 0.35)",
        shelf: "inset 0 -8px 10px -6px rgba(43,36,28,0.45)",
      },
      backgroundImage: {
        "wood-grain":
          "repeating-linear-gradient(180deg, rgba(43,36,28,0.06) 0px, rgba(43,36,28,0.06) 1px, transparent 1px, transparent 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
