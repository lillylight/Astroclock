import type { Config } from "tailwindcss";

// Try to load the typography plugin, but don't fail if it's not available
let typographyPlugin = null;
try {
  typographyPlugin = require('@tailwindcss/typography');
} catch (e) {
  console.warn('Typography plugin not available, continuing without it');
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
      },
      animation: {
        'slide-left': 'slide-left 0.5s ease-out forwards',
        'slide-right': 'slide-right 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        'slide-left': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      typography: typographyPlugin ? {
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            a: {
              color: 'var(--accent)',
              '&:hover': {
                color: 'var(--accent)',
              },
            },
            h1: {
              color: 'white',
            },
            h2: {
              color: 'white',
            },
            h3: {
              color: 'white',
            },
            h4: {
              color: 'white',
            },
            strong: {
              color: '#e2e2e2',
            },
          },
        },
      } : {},
    },
  },
  plugins: typographyPlugin ? [typographyPlugin] : [],
};

export default config;
