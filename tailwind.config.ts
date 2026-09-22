import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  // Bootstrap provides the base/reset styles for this project.
  // Tailwind is used ONLY for utility classes (spacing, flex helpers, etc.)
  // so we disable Tailwind's own reset to avoid the two fighting each other.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          500: "#2f6fed",
          600: "#2557c7",
          700: "#1c439c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
