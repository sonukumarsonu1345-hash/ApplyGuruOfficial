import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1730",
          50: "#F2F4F8",
          100: "#E1E6EF",
          200: "#B9C3D8",
          300: "#8695B8",
          400: "#556490",
          500: "#354268",
          600: "#232E4D",
          700: "#182140",
          800: "#10192E",
          900: "#0A1121",
          950: "#060A15",
        },
        paper: {
          DEFAULT: "#F6F5F0",
          dim: "#EFEDE4",
        },
        saffron: {
          DEFAULT: "#E8A33D",
          50: "#FDF6E9",
          100: "#FAEBCC",
          200: "#F4D394",
          300: "#EEBC5D",
          400: "#E8A33D",
          500: "#D48A22",
          600: "#B06D19",
          700: "#864F13",
        },
        emerald: {
          DEFAULT: "#1C8A6B",
          50: "#E7F5F0",
          100: "#C6E9DC",
          200: "#8FD3BB",
          300: "#54BB9B",
          400: "#2A9F80",
          500: "#1C8A6B",
          600: "#146D54",
          700: "#0F5442",
        },
        plum: {
          DEFAULT: "#5B3B8C",
          50: "#F1ECF8",
          100: "#DDD0EE",
          200: "#BDA3DD",
          300: "#9C77CB",
          400: "#7C56AB",
          500: "#5B3B8C",
          600: "#472E6D",
          700: "#352353",
        },
        rust: {
          DEFAULT: "#C6602E",
          50: "#FBEEE5",
          100: "#F3D3BB",
          200: "#E7AC81",
          300: "#DA8654",
          400: "#C6602E",
          500: "#A44B22",
          600: "#7E3A1B",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
        "grid-lines": "linear-gradient(to right, rgba(14,23,48,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,23,48,0.05) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(232,163,61,0.35)",
        "glow-plum": "0 20px 60px -20px rgba(91,59,140,0.35)",
        premium: "0 30px 80px -35px rgba(10,17,33,0.45)",
        "premium-sm": "0 12px 30px -14px rgba(10,17,33,0.3)",
        "inner-glass": "inset 0 1px 0 0 rgba(255,255,255,0.35)",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        ticker: "ticker 38s linear infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "gradient-x": "gradient-x 8s ease infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
