import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1360px" } },
    extend: {
      colors: {
        void: "hsl(var(--void))",
        deep: "hsl(var(--deep))",
        star: "hsl(var(--star))",
        dim: "hsl(var(--dim))",
        ion: "hsl(var(--ion))",
        plasma: "hsl(var(--plasma))",
        solar: "hsl(var(--solar))",
        line: "hsl(var(--line))",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        flicker: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".55" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spin-slow 30s linear infinite",
        scan: "scan 4s linear infinite",
        flicker: "flicker 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};
export default config;
