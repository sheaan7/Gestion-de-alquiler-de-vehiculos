import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        head: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
