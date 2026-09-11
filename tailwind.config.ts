import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: "#F36B21",
          dark: "#D8560F",
          light: "#FF8A42",
        },
        charcoal: {
          DEFAULT: "#101010",
          soft: "#17171A",
          coldbg: "#0D0D0D",
        },
        pearl: {
          DEFAULT: "#F5F4F0",
          dim: "#EAE8E2",
        },
        silver: {
          DEFAULT: "#B9BDC1",
          dark: "#8B9095",
        },
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "Tahoma", "Arial", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      opacity: {
        8: "0.08",
        12: "0.12",
        14: "0.14",
        15: "0.15",
        16: "0.16",
        18: "0.18",
        35: "0.35",
        45: "0.45",
        55: "0.55",
        58: "0.58",
        62: "0.62",
        65: "0.65",
        68: "0.68",
        72: "0.72",
        82: "0.82",
        85: "0.85",
        92: "0.92",
        98: "0.98",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.9s ease forwards",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
