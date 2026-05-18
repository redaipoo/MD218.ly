import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        gold: {
          DEFAULT: '#ffffff',
          light: '#f0f0f0',
          dark: '#cccccc',
        },
        navy: {
          DEFAULT: '#1a0808',
          light: '#2d1212',
          dark: '#0f0505',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        crimson: {
          DEFAULT: '#8B1A1A',
          light: '#A52A2A',
          dark: '#5C0E0E',
          deep: '#3D0909',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
      },
      boxShadow: {
        'glow-crimson': '0 0 20px rgba(139, 26, 26, 0.3), 0 0 40px rgba(139, 26, 26, 0.1)',
        'glow-crimson-lg': '0 0 30px rgba(139, 26, 26, 0.4), 0 0 60px rgba(139, 26, 26, 0.15)',
        'glow-soft': '0 0 15px rgba(255, 255, 255, 0.05), 0 0 30px rgba(255, 255, 255, 0.02)',
        'glow-green': '0 0 20px rgba(16, 124, 16, 0.3), 0 0 40px rgba(16, 124, 16, 0.1)',
        'premium': '0 4px 24px rgba(0, 0, 0, 0.25), 0 1px 4px rgba(0, 0, 0, 0.15)',
        'premium-lg': '0 8px 40px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 20px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale3d(0.95, 0.95, 1)' },
          '100%': { opacity: '1', transform: 'scale3d(1, 1, 1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
        'shimmer': {
          '0%': { transform: 'translate3d(-100%, 0, 0)' },
          '100%': { transform: 'translate3d(100%, 0, 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fade-in-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in-scale': 'fade-in-scale 0.32s cubic-bezier(0.16, 1, 0.3, 1) both',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '48px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
