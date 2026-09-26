import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Fira Code", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        ring: "var(--ring)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        // Primary: Deep Blue Identity
        brand: {
          50: "#EBF2FF",
          100: "#D6E4FF",
          200: "#ADC8FF",
          300: "#85ADFF",
          400: "#5C91FF",
          500: "#0B5CFF",
          600: "#0947CC",
          700: "#073599",
          800: "#052466",
          900: "#031333",
          DEFAULT: "#0B5CFF",
        },
        // Indigo
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          DEFAULT: "#4F46E5",
        },
        // Violet
        violet: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          DEFAULT: "#7C3AED",
        },
        // Accent Cyan / Ice Blue
        cyan: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          DEFAULT: "#22D3EE",
        },
        // Premium Gold (subtle accent)
        gold: {
          light: "#F5E6C8",
          DEFAULT: "#D6A84F",
          dark: "#B8922E",
        },
      },
      boxShadow: {
        "science": "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(11,92,255,0.04)",
        "science-hover": "0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(11,92,255,0.08)",
        "glow-blue": "0 0 24px -4px rgba(11, 92, 255, 0.25)",
        "glow-indigo": "0 0 24px -4px rgba(79, 70, 229, 0.25)",
        "glow-violet": "0 0 24px -4px rgba(124, 58, 237, 0.2)",
        "glow-cyan": "0 0 20px -4px rgba(34, 211, 238, 0.25)",
        "glass": "0 4px 24px rgba(0, 0, 0, 0.04)",
        "card": "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0B5CFF 0%, #4F46E5 100%)",
        "gradient-cosmic": "linear-gradient(135deg, #0B5CFF 0%, #4F46E5 50%, #7C3AED 100%)",
        "gradient-full": "linear-gradient(135deg, #0B5CFF 0%, #4F46E5 40%, #7C3AED 70%, #22D3EE 100%)",
        "gradient-light": "linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)",
        "gradient-section": "linear-gradient(180deg, #F7F9FC 0%, #FFFFFF 100%)",
        "gradient-hero": "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(11,92,255,0.06) 0%, rgba(79,70,229,0.03) 40%, transparent 70%)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      animation: {
        "float": "float 8s ease-in-out infinite",
        "orbit": "orbit 20s linear infinite",
        "orbit-reverse": "orbit 30s linear infinite reverse",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.6s ease-out both",
        "gradient-shift": "gradientShift 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-6px) rotate(0.5deg)" },
          "50%": { transform: "translateY(-10px) rotate(0deg)" },
          "75%": { transform: "translateY(-4px) rotate(-0.5deg)" },
        },
        orbit: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(11,92,255,0.1)", opacity: "1" },
          "50%": { boxShadow: "0 0 40px rgba(11,92,255,0.2)", opacity: "0.95" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
