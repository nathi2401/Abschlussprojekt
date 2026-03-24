import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        netflix: "#E50914",
        amazon: "#082a4d",
        disney: "#1db9f5",
        dark: "#0f172a",
        surface: "#111827",
        "surface-2": "#1e293b"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
