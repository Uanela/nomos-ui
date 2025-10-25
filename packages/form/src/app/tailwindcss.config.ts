/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "testimonial-slide-in": {
          "0%, 100%": { transform: "translateX(100%)" },
          "25%, 75%": { transform: "translateX(0)" },
        },
        "testimonial-slide-out": {
          "0%, 100%": { transform: "translateX(0%)" },
          "25%, 75%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "testimonial-slide-in": "testimonial-slide-in 0.25s",
        "testimonial-slide-out": "testimonial-slide-out 0.25s",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      colors: {
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        ring: "hsl(var(--ring))",
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        primary: {
          DEFAULT: "#4a8052",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0f8f1",
          100: "#daeedd",
          200: "#b8ddc0",
          300: "#8dc89d",
          400: "#68b07a",
          500: "#4a8052",
          600: "#3a6642",
          700: "#2f5136",
          800: "#27402c",
          900: "#213525",
          950: "#101c13",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#FDF8F0",
          100: "#FAF0DC",
          200: "#F5E0B9",
          300: "#EFCD91",
          400: "#EABC74",
          500: "#E5B35C", // Logo yellow
          600: "#D89838",
          700: "#B77B28",
          800: "#936220",
          900: "#78511C",
          950: "#422C0D",
        },
        tertiary: {
          50: "#f2f7f3",
          100: "#e0ebe2",
          200: "#c3d8c7",
          300: "#9bbfa3",
          400: "#70a07b",
          500: "#2d5f3c",
          600: "#244c30",
          700: "#1e3d27",
          800: "#193121",
          900: "#15281c",
          950: "#0b140e",
        },
        quartenary: {
          50: "#f4faf5",
          100: "#e7f3e9",
          200: "#d0e7d4",
          300: "#afd6b5",
          400: "#88bd8f",
          500: "#6b9e6d",
          600: "#538056",
          700: "#426545",
          800: "#37513a",
          900: "#2e4230",
          950: "#162419",
        },
      },
    },
  },
  plugins: ["@tailwindcss/postcss"],
  corePlugins: {
    //...
    textStroke: false, // Disable the default text-stroke utility
  },
};

export default config;
