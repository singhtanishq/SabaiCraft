/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SabaiCraft Brand Colors
        sabai: {
          50: '#fefae0',
          100: '#fdf4c8',
          200: '#fae89c',
          300: '#f5d86b',
          400: '#f0c83a',
          500: '#d8a53f', // Gold
          600: '#b8860b',
          700: '#926809',
          800: '#75540d',
          900: '#604812',
        },
        olive: {
          50: '#f6f8f3',
          100: '#ebeae2',
          200: '#d7d5c9',
          300: '#bdb9a8',
          400: '#9e9b83',
          500: '#858267',
          600: '#6d6b54',
          700: '#5a5845',
          800: '#4d4b3c',
          900: '#424133',
          950: '#283618', // Dark olive - primary
        },
        sage: {
          50: '#f5f7f3',
          100: '#e9ece4',
          200: '#d4dac9',
          300: '#b7c1a4',
          400: '#94a37a',
          500: '#78895c',
          600: '#606c38', // Sage green - secondary
          700: '#4e552e',
          800: '#42462a',
          900: '#3a3c25',
        },
        cream: {
          50: '#fefdfa',
          100: '#fdfaf3',
          200: '#faf3e2',
          300: '#f6eccb',
          400: '#f2e2ae',
          500: '#eed78d',
          600: '#e9cb6d',
          700: '#e4c050',
          800: '#dfb538',
          900: '#d8a53f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.25' }],
        'heading-xl': ['1.875rem', { lineHeight: '1.3' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.35' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        'space-4xs': '0.125rem',  // 2px
        'space-3xs': '0.25rem',   // 4px
        'space-2xs': '0.375rem',  // 6px
        'space-xs': '0.5rem',     // 8px
        'space-sm': '0.75rem',    // 12px
        'space-md': '1rem',       // 16px
        'space-lg': '1.5rem',     // 24px
        'space-xl': '2rem',       // 32px
        'space-2xl': '3rem',      // 48px
        'space-3xl': '4rem',      // 64px
        'space-4xl': '6rem',      // 96px
        'space-5xl': '8rem',      // 128px
      },
      borderRadius: {
        'radius-none': '0',
        'radius-sm': '0.25rem',   // 4px
        'radius-md': '0.5rem',    // 8px
        'radius-lg': '0.75rem',   // 12px
        'radius-xl': '1rem',      // 16px
        'radius-2xl': '1.5rem',   // 24px
        'radius-full': '9999px',
      },
      boxShadow: {
        'shadow-xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        'shadow-md': '0 4px 8px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'shadow-lg': '0 12px 24px -4px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.04)',
        'shadow-xl': '0 20px 40px -6px rgb(0 0 0 / 0.08), 0 8px 16px -8px rgb(0 0 0 / 0.04)',
        'shadow-elevated': '0 25px 50px -12px rgb(0 0 0 / 0.12)',
        'shadow-inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      transitionDuration: {
        'duration-instant': '50ms',
        'duration-fast': '150ms',
        'duration-normal': '250ms',
        'duration-slow': '350ms',
        'duration-slower': '500ms',
      },
      transitionTimingFunction: {
        'ease-in-out-cubic': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-out': 'fadeOut 150ms ease-in',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'slide-left': 'slideLeft 300ms ease-out',
        'slide-right': 'slideRight 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-out': 'scaleOut 150ms ease-in',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      zIndex: {
        'z-dropdown': '100',
        'z-sticky': '200',
        'z-modal-backdrop': '300',
        'z-modal': '400',
        'z-popover': '500',
        'z-tooltip': '600',
        'z-toast': '700',
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}