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
        black:         "#09090B",
        surface:       "#111113",
        elevated:      "#18181B",
        border:        "#27272A",
        crimson:       "#B91C1C",
        "crimson-dim": "#991B1B",
        gold:          "#C89B3C",
        "gold-dim":    "#8A6A28",
        success:       "#16A34A",
        danger:        "#DC2626",
        text:          "#F4F4F5",
        muted:         "#A1A1AA",
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body:    ["Inter", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
