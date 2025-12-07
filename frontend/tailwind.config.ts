import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Colores personalizados para el tema cyberpunk
        'cyber-black': '#0a0a0f',
        'cyber-gray': '#1a1a24',
        'neon-cyan': '#00f3ff',
        'solana': '#14f195',
      },
    },
  },
  plugins: [],
};

export default config;
