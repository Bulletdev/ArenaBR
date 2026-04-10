import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:       "#0A0E1A",
        card:       "#0F1823",
        muted:      "#1A2235",
        border:     "#252D3D",
        gold:       "#C89B3C",
        "gold-dim": "#8A6A28",
        teal:       "#0596AA",
        "teal-dim": "#047A8A",
        success:    "#00D364",
        danger:     "#FF4444",
      },
      fontFamily: {
        body:    ["Exo 2", "sans-serif"],
        display: ["Rajdhani", "sans-serif"],
        mono:    ["Share Tech Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
