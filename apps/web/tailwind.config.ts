import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/providers/**/*.{ts,tsx}",
    "../../packages/shared/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        panel: "hsl(var(--panel))",
        "panel-foreground": "hsl(var(--panel-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        secondary: "hsl(var(--secondary))",
        ring: "hsl(var(--ring))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      boxShadow: {
        panel:
          "0 0 0 1px rgba(255,255,255,0.05), 0 24px 80px -42px rgba(6,182,212,0.45), 0 24px 90px -54px rgba(124,58,237,0.45)",
        glow:
          "0 0 0 1px rgba(34,211,238,0.18), 0 16px 54px -28px rgba(6,182,212,0.55), 0 16px 70px -40px rgba(124,58,237,0.45)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"]
      },
      animation: {
        shimmer: "shimmer 2.8s linear infinite",
        blink: "blink 1s step-end infinite",
        float: "float 8s ease-in-out infinite"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        },
        blink: {
          "50%": { opacity: "0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      }
    }
  },
  plugins: [typography]
};

export default config;
