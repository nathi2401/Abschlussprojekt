/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#060b16",
          900: "#0b1220",
          800: "#111b2e",
          700: "#172338"
        },
        netflix: "#e50914",
        amazon: "#0f3d91",
        disney: "#54b8ff",
        accent: "#ffb347"
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 18px 50px rgba(0,0,0,0.35)"
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at top left, rgba(229,9,20,0.2), transparent 30%), radial-gradient(circle at top right, rgba(84,184,255,0.18), transparent 28%), radial-gradient(circle at bottom, rgba(15,61,145,0.28), transparent 35%)"
      }
    }
  },
  plugins: []
};
